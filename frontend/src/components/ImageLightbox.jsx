import { useEffect } from 'react';
import { Icon } from './Icons.jsx';

export default function ImageLightbox({ src, alt, onClose }) {
  useEffect(() => {
    if (!src) return undefined;
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [src, onClose]);

  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Review photo"
    >
      <button onClick={onClose} aria-label="Close photo" className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20">
        <Icon.Close className="h-6 w-6" />
      </button>
      <img src={src} alt={alt} className="max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl" />
    </div>
  );
}
