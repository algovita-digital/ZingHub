const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };

export const Icon = {
  Bolt: (p) => (<svg viewBox="0 0 24 24" {...base} {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg>),
  Wind: (p) => (<svg viewBox="0 0 24 24" {...base} {...p}><path d="M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h8" /></svg>),
  Battery: (p) => (<svg viewBox="0 0 24 24" {...base} {...p}><rect x="2" y="7" width="17" height="10" rx="2" /><path d="M22 11v2M6 10v4M10 10v4" /></svg>),
  Drop: (p) => (<svg viewBox="0 0 24 24" {...base} {...p}><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" /></svg>),
  Car: (p) => (<svg viewBox="0 0 24 24" {...base} {...p}><path d="M5 16V11l2-5h10l2 5v5M3 16h18v3H3zM7 13h.01M17 13h.01" /></svg>),
  Leaf: (p) => (<svg viewBox="0 0 24 24" {...base} {...p}><path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15M5 19l7-7" /></svg>),
  Bulb: (p) => (<svg viewBox="0 0 24 24" {...base} {...p}><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z" /></svg>),
  Truck: (p) => (<svg viewBox="0 0 24 24" {...base} {...p}><path d="M2 6h12v11H2zM14 10h4l4 3v4h-8" /><circle cx="7" cy="19" r="1.8" /><circle cx="18" cy="19" r="1.8" /></svg>),
  Shield: (p) => (<svg viewBox="0 0 24 24" {...base} {...p}><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" /><path d="m9 12 2 2 4-4" /></svg>),
  Close: (p) => (<svg viewBox="0 0 24 24" {...base} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>),
  Camera: (p) => (<svg viewBox="0 0 24 24" {...base} {...p}><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></svg>),
  Check: (p) => (<svg viewBox="0 0 24 24" {...base} {...p}><path d="m5 12 5 5 9-10" /></svg>),
  WhatsApp: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.9L2 22l5.25-1.38A9.9 9.9 0 1 0 12.04 2zm0 1.8a8.1 8.1 0 0 1 6.9 12.3 8.1 8.1 0 0 1-10.9 2.9l-.3-.18-3.1.82.83-3.03-.2-.31A8.1 8.1 0 0 1 12.04 3.8zM8.6 7.6c-.2 0-.5.07-.7.35-.25.28-.95.93-.95 2.27s.98 2.63 1.12 2.8c.14.2 1.9 3.05 4.7 4.15 2.3.9 2.76.72 3.26.67.5-.05 1.6-.65 1.83-1.28.22-.63.22-1.17.15-1.28-.07-.12-.25-.2-.53-.33-.28-.14-1.6-.8-1.85-.88-.25-.1-.43-.14-.6.13-.2.28-.7.88-.85 1.06-.16.18-.32.2-.6.07-.27-.14-1.15-.42-2.2-1.35-.8-.72-1.35-1.6-1.5-1.88-.16-.27 0-.42.12-.55.12-.12.27-.32.4-.48.14-.16.18-.28.27-.46.1-.18.05-.35-.02-.48-.07-.14-.6-1.5-.85-2.05-.2-.5-.42-.5-.6-.5z" />
    </svg>
  ),
  Star: (p) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" /></svg>),
};
