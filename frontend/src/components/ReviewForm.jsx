import { useEffect, useRef, useState } from 'react';
import { api } from '../api/client.js';
import StarRating from './StarRating.jsx';
import { Icon } from './Icons.jsx';
import ImageLightbox from './ImageLightbox.jsx';

const MAX = 5 * 1024 * 1024;

export default function ReviewForm({ onSubmitted }) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState('');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  function pick(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) return setError('Please choose a JPG, PNG or WEBP image');
    if (f.size > MAX) return setError('Image must be 5MB or smaller');
    setError('');
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function clearFile() {
    setFile(null);
    setPreview('');
    if (fileRef.current) fileRef.current.value = '';
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (name.trim().length < 2) return setError('Please enter your name');
    if (!rating) return setError('Please select a star rating');
    if (comment.trim().length < 3) return setError('Please write a short review');

    const fd = new FormData();
    fd.append('name', name.trim());
    fd.append('rating', rating);
    fd.append('comment', comment.trim());
    if (file) fd.append('image', file);

    setLoading(true);
    try {
      const res = await api.createReview(fd);
      setDone(res.message);
      onSubmitted?.(res);
      setName(''); setRating(0); setComment(''); clearFile();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-xl ring-1 ring-black/5">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green-100 text-green-600"><Icon.Check className="h-7 w-7" /></span>
        <p className="mt-4 text-lg font-bold">{done}</p>
        <button onClick={() => setDone('')} className="mt-4 text-sm font-semibold text-brand hover:underline">Write another review</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5 rounded-3xl bg-white p-6 shadow-xl ring-1 ring-black/5 sm:p-8">
      <h3 className="text-xl font-extrabold">Share your experience</h3>

      <div>
        <label htmlFor="r-name" className="label">Your Name</label>
        <input id="r-name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Anjali" maxLength={60} />
      </div>

      <div>
        <span className="label">Your Rating</span>
        <StarRating value={rating} onChange={setRating} />
      </div>

      <div>
        <label htmlFor="r-comment" className="label">Your Review</label>
        <textarea id="r-comment" rows={3} className="input resize-none" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Good product, very useful!" maxLength={500} />
      </div>

      <div>
        <span className="label">Photo of your product (optional)</span>
        {preview ? (
          <div className="relative">
            <button type="button" onClick={() => setPreviewOpen(true)} aria-label="View selected photo" className="flex h-40 w-full items-center justify-center overflow-hidden rounded-2xl bg-gray-50 p-2 ring-2 ring-brand/30 focus-visible:outline-none focus-visible:ring-4">
              <img src={preview} alt="Selected review photo" className="h-full w-full object-contain" />
            </button>
            <button type="button" onClick={clearFile} aria-label="Remove photo" className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-ink text-white shadow">
              <Icon.Close className="h-4 w-4" />
            </button>
            <p className="mt-1 text-xs text-gray-500">Select the photo to view it larger.</p>
            <ImageLightbox src={previewOpen ? preview : ''} alt="Selected review photo" onClose={() => setPreviewOpen(false)} />
          </div>
        ) : (
          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed border-gray-300 px-4 py-4 text-gray-600 transition hover:border-brand hover:bg-brand-soft">
            <Icon.Camera className="h-6 w-6 text-brand" />
            <span className="text-sm font-semibold">Tap to upload a photo (JPG, PNG, WEBP · max 5MB)</span>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={pick} />
          </label>
        )}
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Submitting…' : 'Submit Review'}</button>
    </form>
  );
}
