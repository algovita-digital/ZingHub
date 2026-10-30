import { Router } from 'express';
import Product from '../models/Product.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { uploadSingleImage } from '../middleware/upload.js';
import { uploadBuffer, deleteImage } from '../config/cloudinary.js';
import { ensureDefaultProduct } from '../seed.js';

const router = Router();

// Public: the product shown on the landing page
router.get('/main', async (_req, res, next) => {
  try {
    let product = await Product.findOne({ isActive: true }).sort({ createdAt: 1 });
    if (!product) product = await ensureDefaultProduct();
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// Admin: verify key (used by the admin page login)
router.get('/admin/check', adminAuth, (_req, res) => res.json({ ok: true }));

// Admin: update text fields
router.put('/:id', adminAuth, async (req, res, next) => {
  try {
    const allowed = ['name', 'tagline', 'description', 'price', 'mrp', 'features', 'isActive'];
    const update = {};
    for (const key of allowed) if (req.body[key] !== undefined) update[key] = req.body[key];
    const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// Admin: add an image (field name: "image")
router.post('/:id/images', adminAuth, uploadSingleImage, async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Please choose an image' });
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { url, publicId } = await uploadBuffer(req.file.buffer, 'products');
    product.images.push({ url, publicId, alt: String(req.body.alt || product.name).slice(0, 120) });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

// Admin: remove an image
router.delete('/:id/images/:imageId', adminAuth, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const image = product.images.id(req.params.imageId);
    if (!image) return res.status(404).json({ message: 'Image not found' });

    await deleteImage(image.publicId);
    image.deleteOne();
    await product.save();
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// Admin: move an image to the front (becomes the hero image)
router.patch('/:id/images/:imageId/primary', adminAuth, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const idx = product.images.findIndex((i) => String(i._id) === req.params.imageId);
    if (idx === -1) return res.status(404).json({ message: 'Image not found' });
    const [img] = product.images.splice(idx, 1);
    product.images.unshift(img);
    await product.save();
    res.json(product);
  } catch (err) {
    next(err);
  }
});

export default router;
