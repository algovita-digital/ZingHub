import { useEffect, useRef, useState } from 'react';
import { api } from '../api/client.js';
import { formatPrice } from '../config.js';
import Logo from './Logo.jsx';
import { Icon } from './Icons.jsx';

const KEY = 'zinghub_admin_key';

export default function AdminPanel() {
  const [key, setKey] = useState(() => sessionStorage.getItem(KEY) || '');
  const [authed, setAuthed] = useState(false);
  const [product, setProduct] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderActionId, setOrderActionId] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const fileRef = useRef(null);

  const flash = (type, text) => setMsg({ type, text });

  async function login(e) {
    e?.preventDefault();
    setBusy(true);
    try {
      await api.checkAdmin(key);
      const nextProduct = await api.getProduct();
      sessionStorage.setItem(KEY, key);
      setProduct(nextProduct);
      setAuthed(true);
      flash('', '');
      setOrdersLoading(true);
      try {
        setOrders(await api.getOrders(key));
      } catch (err) {
        flash('error', err.message);
      } finally {
        setOrdersLoading(false);
      }
    } catch (err) {
      setAuthed(false);
      flash('error', err.message === 'Unauthorized' ? 'Wrong admin key' : err.message);
    } finally {
      setBusy(false);
    }
  }

  async function refreshOrders() {
    setOrdersLoading(true);
    try {
      setOrders(await api.getOrders(key));
    } catch (err) {
      flash('error', err.message);
    } finally {
      setOrdersLoading(false);
    }
  }

  async function updateOrderStatus(orderId, status) {
    setOrderActionId(orderId);
    try {
      const updatedOrder = await api.updateOrderStatus(orderId, status, key);
      setOrders((current) => current.map((order) => order._id === orderId ? updatedOrder : order));
      flash('ok', 'Order status updated');
    } catch (err) {
      flash('error', err.message);
    } finally {
      setOrderActionId('');
    }
  }

  async function removeOrder(orderId) {
    if (!confirm('Remove this order? This cannot be undone.')) return;
    setOrderActionId(orderId);
    try {
      await api.deleteOrder(orderId, key);
      setOrders((current) => current.filter((order) => order._id !== orderId));
      flash('ok', 'Order removed');
    } catch (err) {
      flash('error', err.message);
    } finally {
      setOrderActionId('');
    }
  }

  useEffect(() => {
    if (key) login();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function run(fn, okText) {
    setBusy(true);
    try {
      setProduct(await fn());
      flash('ok', okText);
    } catch (err) {
      flash('error', err.message);
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  const upload = (e) => {
    const files = [...(e.target.files || [])];
    if (!files.length) return;
    (async () => {
      setBusy(true);
      try {
        let latest = product;
        for (const f of files) latest = await api.uploadProductImage(product._id, f, key);
        setProduct(latest);
        flash('ok', `${files.length} image${files.length > 1 ? 's' : ''} uploaded`);
      } catch (err) {
        flash('error', err.message);
      } finally {
        setBusy(false);
        if (fileRef.current) fileRef.current.value = '';
      }
    })();
  };

  const logout = () => {
    sessionStorage.removeItem(KEY);
    setAuthed(false);
    setKey('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-ink">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Logo className="h-9" />
          <div className="flex items-center gap-4 text-sm font-semibold text-white/80">
            <a href="#top" onClick={() => (window.location.hash = '')} className="hover:text-brand">← Back to site</a>
            {authed && <button onClick={logout} className="hover:text-brand">Log out</button>}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10">
        {!authed ? (
          <form onSubmit={login} className="mx-auto max-w-sm space-y-4 rounded-3xl bg-white p-8 shadow-xl">
            <h1 className="text-2xl font-extrabold">Admin login</h1>
            <p className="text-sm text-gray-600">Enter the ADMIN_KEY from your backend .env file.</p>
            <input type="password" className="input" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Admin key" autoComplete="current-password" />
            {msg.text && <p className="text-sm font-semibold text-red-600">{msg.text}</p>}
            <button className="btn-primary w-full" disabled={busy || !key}>{busy ? 'Checking…' : 'Log in'}</button>
          </form>
        ) : (
          <>
            {msg.text && (
              <p className={`mb-5 rounded-xl px-4 py-3 text-sm font-semibold ${msg.type === 'ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{msg.text}</p>
            )}

            <section aria-labelledby="orders-heading" className="mb-12">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h1 id="orders-heading" className="text-2xl font-extrabold">Orders</h1>
                  <p className="text-gray-600">{orders.length} order{orders.length === 1 ? '' : 's'}</p>
                </div>
                <button onClick={refreshOrders} disabled={ordersLoading || busy || Boolean(orderActionId)} className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-ink transition hover:border-brand disabled:opacity-60">
                  {ordersLoading ? 'Refreshing…' : 'Refresh orders'}
                </button>
              </div>

              {ordersLoading && orders.length === 0 ? (
                <p className="mt-5 rounded-2xl bg-white p-6 text-center text-gray-500 shadow-sm">Loading orders…</p>
              ) : orders.length === 0 ? (
                <p className="mt-5 rounded-2xl bg-white p-6 text-center text-gray-500 shadow-sm">No orders yet.</p>
              ) : (
                <ul className="mt-5 space-y-4">
                  {orders.map((order) => (
                    <li key={order._id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h2 className="font-bold">{order.productDetails?.name || 'Product'} · Qty {order.productDetails?.quantity || 1}</h2>
                          <p className="mt-1 text-sm text-gray-500">
                            {order.createdAt ? new Date(order.createdAt).toLocaleString() : ''} {order.status && `· ${order.status}`}
                          </p>
                        </div>
                        <p className="font-extrabold">{formatPrice(order.totalAmount)}</p>
                      </div>
                      <div className="mt-4 grid gap-3 border-t border-gray-100 pt-4 sm:grid-cols-2">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Customer</p>
                          <p className="mt-1 font-semibold">{order.name}</p>
                          <a href={`tel:${order.phone}`} className="mt-1 inline-block text-sm text-brand hover:underline">{order.phone}</a>
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Delivery address</p>
                          <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">{order.address}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                          Status
                          <select
                            value={order.status || 'new'}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            disabled={Boolean(orderActionId)}
                            className="rounded-lg border border-gray-200 bg-white px-3 py-2 font-semibold text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:opacity-60"
                          >
                            {['new', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
                              <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                            ))}
                          </select>
                        </label>
                        <button
                          type="button"
                          onClick={() => removeOrder(order._id)}
                          disabled={Boolean(orderActionId)}
                          className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-60"
                        >
                          {orderActionId === order._id ? 'Please wait…' : 'Remove order'}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold">Product images</h2>
                <p className="text-gray-600">{product.name} · the first image is shown in the hero section.</p>
              </div>
              <label className={`btn-primary cursor-pointer ${busy ? 'pointer-events-none opacity-60' : ''}`}>
                <Icon.Camera className="h-5 w-5" /> {busy ? 'Working…' : 'Upload images'}
                <input ref={fileRef} type="file" multiple accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={upload} />
              </label>
            </div>

            {product.images.length === 0 ? (
              <div className="mt-8 rounded-3xl border-2 border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">
                No images uploaded yet. The website is showing the default product photos until you upload some.
              </div>
            ) : (
              <ul className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                {product.images.map((img, i) => (
                  <li key={img._id} className="overflow-hidden rounded-2xl bg-white shadow ring-1 ring-black/5">
                    <div className="relative">
                      <img src={img.url} alt={img.alt} className="aspect-square w-full object-cover" loading="lazy" />
                      {i === 0 && <span className="absolute left-2 top-2 rounded-lg bg-brand px-2 py-1 text-xs font-bold text-white">Main</span>}
                    </div>
                    <div className="flex gap-2 p-3 text-xs font-bold">
                      {i !== 0 && (
                        <button disabled={busy} onClick={() => run(() => api.makePrimaryImage(product._id, img._id, key), 'Main image updated')} className="flex-1 rounded-lg bg-brand-soft py-2 text-brand hover:bg-brand hover:text-white">Make main</button>
                      )}
                      <button disabled={busy} onClick={() => confirm('Delete this image?') && run(() => api.deleteProductImage(product._id, img._id, key), 'Image deleted')} className="flex-1 rounded-lg bg-red-50 py-2 text-red-600 hover:bg-red-600 hover:text-white">Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>
    </div>
  );
}
