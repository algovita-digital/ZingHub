import Logo from './Logo.jsx';

export default function Navbar({ onOrder }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <a href="#top" aria-label="ZingHub home">
          <Logo className="h-9 sm:h-10" />
        </a>
        <nav className="hidden items-center gap-8 text-sm font-semibold text-white/80 md:flex">
          <a href="#features" className="transition hover:text-brand">Features</a>
          <a href="#gallery" className="transition hover:text-brand">Gallery</a>
          <a href="#reviews" className="transition hover:text-brand">Reviews</a>
        </nav>
        <button onClick={onOrder} className="rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark">
          Order Now
        </button>
      </div>
    </header>
  );
}
