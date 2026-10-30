import { useState } from 'react';

export default function Gallery({ images, onOrder }) {
  const [active, setActive] = useState(0);
  const current = images[Math.min(active, images.length - 1)];

  return (
    <section id="gallery" className="bg-brand-soft/60">
      <div className="section">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-brand">Take a closer look</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Product gallery</h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div className="overflow-hidden rounded-3xl bg-white p-3 shadow-xl ring-1 ring-black/5">
            <img src={current.url} alt={current.alt || 'ZingHub Mini Vacuum Cleaner'} className="mx-auto max-h-[560px] w-full rounded-2xl object-contain" loading="lazy" />
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 lg:w-28 lg:flex-col lg:overflow-visible">
            {images.map((img, i) => (
              <button
                key={img._id || img.url}
                onClick={() => setActive(i)}
                aria-label={`Show image ${i + 1}`}
                className={`h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 bg-white p-1 transition-colors active:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand lg:h-28 lg:w-28 ${i === active ? 'border-brand' : 'border-transparent lg:hover:border-brand/40'}`}
              >
                <img src={img.url} alt="" className="h-full w-full rounded-xl object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <button onClick={onOrder} className="btn-primary">Order yours for ₹299</button>
        </div>
      </div>
    </section>
  );
}
