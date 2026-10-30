/** Uses your official logo files from public/images. */
export default function Logo({ onDark = true, className = 'h-10' }) {
  return (
    <img
      src={onDark ? '/images/logo-for-dark.png' : '/images/logo-for-light.png'}
      alt="ZingHub"
      className={`w-auto ${className}`}
      draggable="false"
    />
  );
}

export function LogoIcon({ className = 'h-10 w-10' }) {
  return <img src="/images/logo-icon.png" alt="ZingHub" className={className} draggable="false" />;
}
