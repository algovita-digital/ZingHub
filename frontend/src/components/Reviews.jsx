import { useState } from 'react';
import ReviewForm from './ReviewForm.jsx';
import ImageLightbox from './ImageLightbox.jsx';
import StarRating from './StarRating.jsx';

const timeAgo = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export default function Reviews({ data, loading, onNew }) {
  const { reviews, average, count } = data;
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section id="reviews" className="bg-white">
      <div className="section">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-brand">Customer love</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">What our customers say</h2>
          {count > 0 && (
            <div className="mt-4 flex items-center justify-center gap-3">
              <StarRating value={Math.round(average)} size="h-6 w-6" />
              <span className="font-bold">{average}</span>
              <span className="text-gray-500">({count} review{count > 1 ? 's' : ''})</span>
            </div>
          )}
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
          <div>
            {loading ? (
              <p className="text-center text-gray-500">Loading reviews…</p>
            ) : reviews.length === 0 ? (
              <div className="rounded-3xl border-2 border-dashed border-gray-200 p-10 text-center text-gray-500">
                No reviews yet. Be the first to share your experience!
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {reviews.map((r) => (
                  <article key={r._id} className="flex flex-col rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                    {r.image?.url && (
                      <button
                        type="button"
                        onClick={() => setSelectedImage({ src: r.image.url, alt: `Photo by ${r.name}` })}
                        aria-label={`View photo by ${r.name}`}
                        className="mb-4 flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                      >
                        <img src={r.image.url} alt="" className="h-full w-full object-contain" loading="lazy" />
                      </button>
                    )}
                    <StarRating value={r.rating} />
                    <p className="mt-3 flex-1 text-gray-800">“{r.comment}”</p>
                    <div className="mt-4 flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-sm font-extrabold text-white">{r.name.charAt(0).toUpperCase()}</span>
                      <div>
                        <p className="text-sm font-bold">{r.name}</p>
                        <p className="text-xs text-gray-500">{timeAgo(r.createdAt)}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-24">
            <ReviewForm onSubmitted={onNew} />
          </div>
        </div>
      </div>
      <ImageLightbox src={selectedImage?.src} alt={selectedImage?.alt} onClose={() => setSelectedImage(null)} />
    </section>
  );
}
