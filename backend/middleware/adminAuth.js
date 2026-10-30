import crypto from 'crypto';

export function adminAuth(req, res, next) {
  const expected = process.env.ADMIN_KEY || '';
  const provided = req.header('x-admin-key') || '';
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  const ok = expected.length > 0 && a.length === b.length && crypto.timingSafeEqual(a, b);
  if (!ok) return res.status(401).json({ message: 'Unauthorized' });
  next();
}
