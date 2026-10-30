import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import Review from '../models/Review.js';
import { uploadSingleImage } from '../middleware/upload.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { uploadBuffer, deleteImage } from '../config/cloudinary.js';

const router = Router();

const reviewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many reviews from this device. Please try again later.' },
});

const str = (v) => (typeof v === 'string' ? v.trim() : '');

// Public: approved reviews, newest first
router.get('/', async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 24, 60);
    const reviews = await Review.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('name rating comment image.url createdAt');

    const stats = await Review.aggregate([
      { $match: { isApproved: true } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    res.json({
      reviews,
      average: stats[0] ? Math.round(stats[0].avg * 10) / 10 : 0,
      count: stats[0]?.count || 0,
    });
  } catch (err) {
    next(err);
  }
});

// Public: submit a review (multipart/form-data; optional file field "image")
router.post('/', reviewLimiter, uploadSingleImage, async (req, res, next) => {
  let uploaded = null;
  try {
    const name = str(req.body.name);
    const comment = str(req.body.comment);
    const rating = parseInt(req.body.rating, 10);

    if (name.length < 2 || name.length > 60) return res.status(400).json({ message: 'Please enter your name' });
    if (!(rating >= 1 && rating <= 5)) return res.status(400).json({ message: 'Please choose a rating from 1 to 5' });
    if (comment.length < 3 || comment.length > 500)
      return res.status(400).json({ message: 'Please write a short review (3 to 500 characters)' });

    if (req.file) uploaded = await uploadBuffer(req.file.buffer, 'reviews');

    const review = await Review.create({
      name,
      rating,
      comment,
      image: uploaded || undefined,
      isApproved: process.env.REVIEWS_AUTO_APPROVE !== 'false',
    });

    res.status(201).json({
      message: review.isApproved ? 'Thank you for your review!' : 'Thank you! Your review will appear after approval.',
      review: { _id: review._id, name: review.name, rating: review.rating, comment: review.comment, image: { url: review.image?.url || '' }, createdAt: review.createdAt },
      isApproved: review.isApproved,
    });
  } catch (err) {
    if (uploaded) await deleteImage(uploaded.publicId); // don't leave orphan images
    next(err);
  }
});

// Admin: approve / hide
router.patch('/:id/approve', adminAuth, async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: req.body.isApproved !== false }, { new: true });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (err) {
    next(err);
  }
});

// Admin: delete
router.delete('/:id', adminAuth, async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    await deleteImage(review.image?.publicId);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
