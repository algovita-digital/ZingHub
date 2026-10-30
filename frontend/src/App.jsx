import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from './api/client.js';
import { FALLBACK_IMAGES, WHATSAPP_CHAT_URL, formatPrice } from './config.js';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Features from './components/Features.jsx';
import Gallery from './components/Gallery.jsx';
import Reviews from './components/Reviews.jsx';
import Footer from './components/Footer.jsx';
import OrderModal from './components/OrderModal.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import { Icon } from './components/Icons.jsx';

// Used only if the API is unreachable, so the page still renders.
const DEFAULT_PRODUCT = {
  name: 'Mini Vacuum Cleaner',
  tagline: 'Small size, big power. Clean your car and home in minutes.',
  description:
    'A portable, wireless 2-in-1 blower and vacuum cleaner with a washable filter. Charges over USB and works anywhere.',
  price: 299,
  mrp: null,
  images: [],
};

function useHash() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const on = () => setHash(window.location.hash);
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return hash;
}

export default function App() {
  const hash = useHash();
  const [product, setProduct] = useState(DEFAULT_PRODUCT);
  const [reviewData, setReviewData] = useState({ reviews: [], average: 0, count: 0 });
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [orderOpen, setOrderOpen] = useState(false);

  useEffect(() => {
    api.getProduct().then(setProduct).catch(() => {});
    api.getReviews().then(setReviewData).catch(() => {}).finally(() => setReviewsLoading(false));
  }, []);

  const images = useMemo(() => (product.images?.length ? product.images : FALLBACK_IMAGES), [product]);
  const openOrder = useCallback(() => setOrderOpen(true), []);
  const closeOrder = useCallback(() => setOrderOpen(false), []);

  const onNewReview = (res) => {
    if (!res.isApproved) return;
    setReviewData((d) => {
      const reviews = [res.review, ...d.reviews];
      const count = d.count + 1;
      const average = Math.round(((d.average * d.count + res.review.rating) / count) * 10) / 10;
      return { reviews, average, count };
    });
  };

  if (hash === '#admin') return <AdminPanel />;

  return (
    <>
      <Navbar onOrder={openOrder} />
      <main>
        <Hero product={product} image={images[0]} rating={reviewData} onOrder={openOrder} />
        <Features product={product} />
        <Gallery images={images} onOrder={openOrder} />
        <Reviews data={reviewData} loading={reviewsLoading} onNew={onNewReview} />
      </main>
      <Footer />

      {/* Mobile sticky order bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-white/10 bg-ink/95 px-4 py-3 backdrop-blur sm:hidden">
        <div className="leading-tight text-white">
          <p className="text-xs text-white/60">Cash on Delivery</p>
          <p className="text-xl font-extrabold">{formatPrice(product.price)}</p>
        </div>
        <button onClick={openOrder} className="flex-1 rounded-xl bg-brand py-3 text-base font-bold text-white">Order Now</button>
      </div>

      <a href={WHATSAPP_CHAT_URL} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"
        className="fixed bottom-24 right-4 z-30 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 sm:bottom-6 sm:right-6">
        <Icon.WhatsApp className="h-7 w-7" />
      </a>

      <OrderModal open={orderOpen} onClose={closeOrder} product={product} />
    </>
  );
}
