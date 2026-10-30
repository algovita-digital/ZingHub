import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { ensureDefaultProduct } from '../seed.js';

const router = Router();

const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many orders from this device. Please try again later.' },
});

const str = (v) => (typeof v === 'string' ? v.trim() : '');

// Public: place a COD order
router.post('/', orderLimiter, async (req, res, next) => {
  try {
    const name = str(req.body.name);
    const address = str(req.body.address);
    // keep digits only, drop +91 / 0 prefix
    let phone = str(req.body.phone).replace(/\D/g, '');
    if (phone.length === 12 && phone.startsWith('91')) phone = phone.slice(2);
    if (phone.length === 11 && phone.startsWith('0')) phone = phone.slice(1);
    const quantity = Math.min(Math.max(parseInt(req.body.quantity, 10) || 1, 1), 10);

    if (name.length < 2 || name.length > 80) return res.status(400).json({ message: 'Please enter your full name' });
    if (!/^[6-9]\d{9}$/.test(phone)) return res.status(400).json({ message: 'Enter a valid 10-digit mobile number' });
    if (address.length < 15 || address.length > 400)
      return res.status(400).json({ message: 'Please enter your full delivery address (house, area, district, PIN)' });

    // price always comes from the database, never from the client
    const product = (await Product.findOne({ isActive: true }).sort({ createdAt: 1 })) || (await ensureDefaultProduct());

    const order = await Order.create({
      name,
      phone,
      address,
      productDetails: { product: product._id, name: product.name, price: product.price, quantity },
      totalAmount: product.price * quantity,
    });

    res.status(201).json({
      id: order._id,
      name: order.name,
      phone: order.phone,
      address: order.address,
      productName: product.name,
      quantity,
      totalAmount: order.totalAmount,
    });
  } catch (err) {
    next(err);
  }
});

// Admin: list orders (latest first)
router.get('/', adminAuth, async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
    const orders = await Order.find().sort({ createdAt: -1 }).limit(limit);
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// Admin: update status
router.patch('/:id/status', adminAuth, async (req, res, next) => {
  try {
    const status = str(req.body.status);
    if (!Order.schema.path('status').enumValues.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
});

// Admin: remove an order
router.delete('/:id', adminAuth, async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
