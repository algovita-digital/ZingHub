import Logo from './Logo.jsx';
import { Icon } from './Icons.jsx';
import { WHATSAPP_CHAT_URL } from '../config.js';

export default function Footer() {
  return (
    <footer className="bg-ink pb-28 pt-12 text-white sm:pb-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <Logo className="mx-auto h-9 sm:mx-0" />
          <p className="mt-3 text-sm text-white/60">Smart gadgets for modern living. Cash on Delivery across Kerala.</p>
        </div>
        <a href={WHATSAPP_CHAT_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 font-bold text-white transition hover:bg-[#1fb857]">
          <Icon.WhatsApp className="h-5 w-5" /> Chat on WhatsApp
        </a>
      </div>
      <p className="mt-10 text-center text-xs text-white/40">© {new Date().getFullYear()} ZingHub. All rights reserved.</p>
    </footer>
  );
}
