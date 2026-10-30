import { Icon } from './Icons.jsx';
import { formatPrice } from '../config.js';

export default function Hero({ product, image, rating, onOrder }) {
  return (
    <section id="top" className="relative overflow-hidden bg-ink text-white">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-14 sm:py-20 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-light">
            <Icon.Truck className="h-4 w-4" /> Cash on Delivery across Kerala
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            {product.name.replace('Vacuum Cleaner', '')}
            <span className="text-brand">Vacuum Cleaner</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg text-white/70">{product.tagline}</p>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-white/80">
            {['Wireless', 'USB Rechargeable', '2-in-1 Blower + Vacuum', 'Car & Home'].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Icon.Check className="h-4 w-4 text-brand" /> {t}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex items-end gap-4">
            <span className="text-5xl font-extrabold">{formatPrice(product.price)}</span>
            {product.mrp ? <span className="pb-1 text-xl text-white/40 line-through">{formatPrice(product.mrp)}</span> : null}
            <span className="pb-1.5 text-sm text-white/60">Pay when it arrives</span>
          </div>

          <div className="relative mx-auto mt-8 w-full max-w-sm lg:hidden">
            <div className="absolute inset-4 rounded-[2.5rem] bg-brand/40 blur-2xl" />
            <div className="relative animate-floaty overflow-hidden rounded-[2rem] bg-white p-3 shadow-2xl ring-1 ring-white/10">
              <img src={image.url} alt={image.alt || product.name} className="aspect-square w-full rounded-[1.5rem] object-contain" />
              <span className="absolute right-5 top-5 rounded-xl bg-brand px-3 py-1.5 text-sm font-extrabold text-white shadow-lg">
                {formatPrice(product.price)} only
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button onClick={onOrder} className="btn-primary text-lg">Order Now &rarr;</button>
            <a href="#features" className="btn-ghost">See features</a>
          </div>

          {rating.count > 0 && (
            <p className="mt-6 flex items-center gap-2 text-sm text-white/70">
              <span className="flex text-brand">{Array.from({ length: 5 }, (_, i) => (
                <Icon.Star key={i} className={`h-4 w-4 ${i < Math.round(rating.average) ? '' : 'opacity-25'}`} />
              ))}</span>
              {rating.average} from {rating.count} customer review{rating.count > 1 ? 's' : ''}
            </p>
          )}
        </div>

        <div className="relative mx-auto hidden w-full max-w-md lg:block lg:max-w-none">
          <div className="absolute inset-4 rounded-[2.5rem] bg-brand/40 blur-2xl" />
          <div className="relative animate-floaty overflow-hidden rounded-[2rem] bg-white p-3 shadow-2xl ring-1 ring-white/10">
            <img src={image.url} alt={image.alt || product.name} className="aspect-square w-full rounded-[1.5rem] object-contain" />
            <span className="absolute right-5 top-5 rounded-xl bg-brand px-3 py-1.5 text-sm font-extrabold text-white shadow-lg">
              {formatPrice(product.price)} only
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
