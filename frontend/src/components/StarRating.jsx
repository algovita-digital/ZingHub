import { useState } from 'react';
import { Icon } from './Icons.jsx';

/** Read-only stars when `onChange` is missing, clickable selector otherwise. */
export default function StarRating({ value = 0, onChange, size = 'h-5 w-5' }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  if (!onChange) {
    return (
      <span className="flex text-brand" role="img" aria-label={`${value} out of 5 stars`}>
        {Array.from({ length: 5 }, (_, i) => (
          <Icon.Star key={i} className={`${size} ${i < value ? '' : 'text-gray-200'}`} />
        ))}
      </span>
    );
  }

  return (
    <div className="flex gap-1" onMouseLeave={() => setHover(0)} role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
          className={`transition hover:scale-110 ${n <= shown ? 'text-brand' : 'text-gray-300'}`}
        >
          <Icon.Star className="h-9 w-9" />
        </button>
      ))}
    </div>
  );
}
