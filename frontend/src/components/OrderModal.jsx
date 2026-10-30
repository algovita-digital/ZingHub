import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { buildOrderWhatsAppUrl, formatPrice } from '../config.js';
import { Icon } from './Icons.jsx';

const empty = { name: '', phone: '', address: '' };

export default function OrderModal({ open, onClose, product }) {
  const [form, setForm] = useState(empty);
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [placed, setPlaced] = useState(null);

  useEffect(() => {
    if (!open) return;
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: '' }));
  };

  function validate() {
    const er = {};
    if (form.name.trim().length < 2) er.name = 'Please enter your full name';
    const digits = form.phone.replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '');
    if (!/^[6-9]\d{9}$/.test(digits)) er.phone = 'Enter a valid 10-digit mobile number';
    if (form.address.trim().length < 15) er.address = 'Please enter house name, area, district and PIN code';
    setErrors(er);
    return Object.keys(er).length === 0;
  }

  async function submit(e) {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setReviewing(true);
  }

  async function confirmOrder() {
    setServerError('');
    setLoading(true);
    try {
      const order = await api.createOrder({ ...form, quantity });
      setPlaced(order);
      setTimeout(() => window.location.assign(buildOrderWhatsAppUrl(order)), 1600);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const total = product.price * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/80 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()} role="dialog" aria-modal="true" aria-label="Place your order">
      <div className="flex max-h-[96dvh] w-full max-w-lg animate-pop flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-3xl">
        <div className="flex shrink-0 items-start justify-between bg-ink px-6 py-5 text-white">
          <div>
            <h2 className="text-xl font-extrabold">{placed ? 'Order received!' : reviewing ? 'Review your order' : 'Place your order'}</h2>
            <p className="text-sm text-white/60">{reviewing && !placed ? 'Check your details before confirming' : 'Cash on Delivery · Kerala only'}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white">
            <Icon.Close className="h-6 w-6" />
          </button>
        </div>

        {placed ? (
          <div className="min-h-0 overflow-y-auto overscroll-contain px-6 py-10 text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-100 text-green-600">
              <Icon.Check className="h-8 w-8" />
            </span>
            <h3 className="mt-5 text-xl font-bold">Thank you, {placed.name.split(' ')[0]}!</h3>
            <p className="mt-2 text-gray-600">Opening WhatsApp so you can send your order for confirmation…</p>
            <a href={buildOrderWhatsAppUrl(placed)} className="btn-primary mt-6 w-full bg-[#25D366] shadow-none hover:bg-[#1fb857]">
              <Icon.WhatsApp className="h-5 w-5" /> Open WhatsApp now
            </a>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-6 py-6">
              {reviewing ? (
                <div className="space-y-5">
                  <div className="rounded-2xl bg-brand-soft p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-bold">{product.name}</p>
                        <p className="mt-1 text-sm text-gray-600">{formatPrice(product.price)} × {quantity}</p>
                      </div>
                      <p className="shrink-0 font-extrabold">{formatPrice(total)}</p>
                    </div>
                  </div>
                  <div className="space-y-4 rounded-2xl border border-gray-200 p-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Name</p>
                      <p className="mt-1 font-semibold">{form.name.trim()}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Phone number</p>
                      <p className="mt-1 font-semibold">{form.phone.trim()}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Delivery address</p>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">{form.address.trim()}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Confirming saves your order and opens WhatsApp with these details ready to send.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between rounded-2xl bg-brand-soft p-4">
                    <div>
                      <p className="font-bold">{product.name}</p>
                      <p className="text-sm text-gray-600">{formatPrice(product.price)} each</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="h-9 w-9 rounded-full bg-white text-xl font-bold shadow transition hover:bg-gray-50" aria-label="Decrease quantity">−</button>
                      <span className="w-5 text-center text-lg font-bold">{quantity}</span>
                      <button type="button" onClick={() => setQuantity((q) => Math.min(10, q + 1))} className="h-9 w-9 rounded-full bg-white text-xl font-bold shadow transition hover:bg-gray-50" aria-label="Increase quantity">+</button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="o-name" className="label">Full Name</label>
                    <input id="o-name" className="input" value={form.name} onChange={set('name')} placeholder="e.g. Muhammed Rafi" autoComplete="name" />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="o-phone" className="label">Phone Number</label>
                    <input id="o-phone" className="input" value={form.phone} onChange={set('phone')} placeholder="10-digit mobile number" inputMode="tel" autoComplete="tel" />
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                  </div>

                  <div>
                    <label htmlFor="o-address" className="label">Full Delivery Address (Kerala)</label>
                    <textarea id="o-address" rows={3} className="input resize-none" value={form.address} onChange={set('address')} placeholder="House name / number, street, area, post office, district, PIN code" autoComplete="street-address" />
                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                  </div>
                </>
              )}

              {serverError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{serverError}</p>}
            </div>

            <div className="shrink-0 border-t border-gray-100 bg-white px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-3 sm:px-6 sm:pb-6 sm:pt-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-gray-600">Total (pay on delivery)</span>
                <span className="text-2xl font-extrabold">{formatPrice(total)}</span>
              </div>

              {reviewing ? (
                <div className="flex gap-2 sm:gap-3">
                  <button type="button" disabled={loading} onClick={() => setReviewing(false)} className="min-h-12 min-w-0 flex-1 whitespace-nowrap rounded-xl border border-gray-200 px-2 py-3 text-sm font-bold text-ink transition hover:bg-gray-50 disabled:opacity-60 sm:px-4 sm:text-base">
                    Edit details
                  </button>
                  <button type="button" disabled={loading} onClick={confirmOrder} className="btn-primary !min-h-12 !min-w-0 !flex-1 !whitespace-nowrap !rounded-xl !px-2 !py-3 !text-sm sm:!px-4 sm:!text-base">
                    {loading ? 'Saving…' : 'Confirm order'}
                  </button>
                </div>
              ) : (
                <button type="submit" disabled={loading} className="btn-primary w-full text-lg">
                  Review order
                </button>
              )}
              <p className="mt-3 text-center text-xs text-gray-500">Your details are used only to deliver your order.</p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
