import { Icon } from './Icons.jsx';

const FEATURES = [
  { icon: Icon.Bolt, title: 'Wireless & USB Rechargeable', text: 'No outlets, no tangled wires. Charge over USB and clean anywhere: car, travel or home.' },
  { icon: Icon.Wind, title: 'Blower + Vacuum in One', text: 'Blow dust out of keyboards and tight spots, or vacuum up stubborn debris. Two tools, one device.' },
  { icon: Icon.Battery, title: 'Small Size, Big Power', text: 'Powerful enough for daily messes, pet hair and spills, yet compact enough to keep in your car.' },
  { icon: Icon.Drop, title: 'Washable, Reusable Filter', text: 'Rinse the filter and use it again. Built to last and reduce waste.' },
  { icon: Icon.Car, title: 'Car & Home Ready', text: 'Perfect for car seats, sofa corners, curtains, stairs and hard-to-reach gaps with the included nozzles.' },
  { icon: Icon.Bulb, title: 'LED Light & Multiple Nozzles', text: 'See dust in dark corners. Brush and flat nozzles help you reach every spot.' },
];

export default function Features({ product }) {
  return (
    <section id="features" className="bg-white">
      <div className="section">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-brand">Why you'll love it</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Smart gadgets for modern living</h2>
          <p className="mt-4 text-lg text-gray-600">{product.description}</p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: I, title, text }) => (
            <article key={title} className="group rounded-3xl border border-gray-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-brand/30 hover:shadow-xl">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand transition group-hover:bg-brand group-hover:text-white">
                <I className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-gray-600">{text}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 grid gap-3 rounded-3xl bg-ink p-6 text-white sm:grid-cols-3 sm:p-8">
          {[
            [Icon.Truck, 'Cash on Delivery', 'Pay at your doorstep, anywhere in Kerala'],
            [Icon.Shield, 'Confirm on WhatsApp', 'We confirm every order personally'],
            [Icon.Leaf, 'Eco-friendly design', 'Washable filter and reusable parts'],
          ].map(([I, t, s]) => (
            <div key={t} className="flex items-start gap-3">
              <I className="mt-1 h-6 w-6 shrink-0 text-brand" />
              <div>
                <p className="font-bold">{t}</p>
                <p className="text-sm text-white/60">{s}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
