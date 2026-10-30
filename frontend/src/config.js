export const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

const WA_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '');
const WA_FALLBACK = import.meta.env.VITE_WHATSAPP_FALLBACK || 'https://walink.me/7obq58';

/** Contact link used by the floating and footer WhatsApp chat buttons. */
export const WHATSAPP_CHAT_URL = 'https://walink.me/6ourj3';

/** WhatsApp link with the saved order details prefilled. */
export function buildOrderWhatsAppUrl(order) {
  if (!WA_NUMBER) return WA_FALLBACK;

  const message = [
    '*New ZingHub Order (Cash on Delivery)*',
    '',
    `Product: ${order.productName}`,
    `Quantity: ${order.quantity}`,
    `Total: ₹${order.totalAmount} (COD)`,
    '',
    `Name: ${order.name}`,
    `Phone: ${order.phone}`,
    `Address: ${order.address}`,
    '',
    `Order ID: ${String(order.id).slice(-6).toUpperCase()}`,
    'Please confirm my order. Thank you!',
  ].join('\n');

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const formatPrice = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

/** Shown until you upload images from the #admin page. Files live in public/images. */
export const FALLBACK_IMAGES = [
  { _id: 'f1', url: '/images/product-poster.jpg', alt: 'ZingHub Mini Vacuum Cleaner with all accessories' },
  { _id: 'f2', url: '/images/product-suction.png', alt: '6000Pa suction, 120W, LED lamp' },
  { _id: 'f3', url: '/images/product-kit.png', alt: 'Vacuum cleaner with nozzles, filter and USB cable' },
  { _id: 'f4', url: '/images/product-battery.png', alt: '2000mAh lithium battery' },
  { _id: 'f5', url: '/images/product-nozzles.jpg', alt: 'Brush nozzle, flat nozzle and USB cable' },
];
