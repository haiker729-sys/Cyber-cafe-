import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  ArrowRight,
  Send
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, shopSettings, setActiveTab, setSelectedToolId } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNav = (tabId: string) => {
    setActiveTab(tabId);
    setSelectedToolId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchTool = (toolId: string) => {
    setSelectedToolId(toolId);
    setActiveTab('tools');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
        setSubscribed(false);
      }, 3500);
    }
  };

  return (
    <footer className="bg-[#101C2D] text-slate-300 pt-14 pb-8 border-t border-slate-800 transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 5 Columns Grid matching screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Column 1: Brand, Tagline, Description & Social Icons (4 cols) */}
          <div className="lg:col-span-4 space-y-4 text-left">
            
            {/* Logo Emblem and Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-transparent flex items-center justify-center shrink-0">
                <svg className="w-10 h-10 drop-shadow-sm" viewBox="0 0 44 44" fill="none">
                  <path d="M6 32V15C6 11.5 9 9 12.5 10.5L20 16L12 28L6 32Z" fill="#EA580C" />
                  <path d="M12.5 10.5C16 12 18.5 15.5 22 20.5L14 33L6 32L12.5 10.5Z" fill="#F97316" />
                  <path d="M38 32V15C38 11.5 35 9 31.5 10.5L24 16L32 28L38 32Z" fill="#EA580C" />
                  <path d="M31.5 10.5C28 12 25.5 15.5 22 20.5L30 33L38 32L31.5 10.5Z" fill="#FB923C" />
                  <circle cx="22" cy="18" r="4.5" fill="#F97316" />
                </svg>
              </div>

              <div>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-xl font-black tracking-tight text-orange-500">MERAJ</span>
                  <span className="text-xl font-black tracking-tight text-white">CAFE POINT</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 block mt-1 tracking-wider uppercase">
                  Online Tools • Cyber Cafe • Digital Services
                </span>
              </div>
            </div>

            {/* Exact Hindi Description from Screenshot */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pr-2">
              आपके डिजिटल काम के लिए एक भरोसेमंद और आसान प्लेटफॉर्म। फोटो, इमेज, PDF और सरकारी सेवाओं के लिए सभी टूल एक जगह पर - बिल्कुल मुफ्त।
            </p>

            {/* Colorful Social Media Circle Buttons matching screenshot */}
            <div className="flex items-center gap-2.5 pt-1">
              {/* Facebook */}
              <a
                href={shopSettings.socialLinks?.facebook || 'https://facebook.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold text-xs hover:scale-110 transition-transform shadow-md"
                aria-label="Facebook"
              >
                f
              </a>
              {/* Instagram */}
              <a
                href={shopSettings.socialLinks?.instagram || 'https://instagram.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs hover:scale-110 transition-transform shadow-md"
                aria-label="Instagram"
              >
                📷
              </a>
              {/* YouTube */}
              <a
                href={shopSettings.socialLinks?.youtube || 'https://youtube.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#FF0000] text-white flex items-center justify-center font-bold text-xs hover:scale-110 transition-transform shadow-md"
                aria-label="YouTube"
              >
                ▶
              </a>
              {/* WhatsApp */}
              <a
                href={`https://wa.me/91${shopSettings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center font-bold text-xs hover:scale-110 transition-transform shadow-md"
                aria-label="WhatsApp"
              >
                💬
              </a>
              {/* Telegram */}
              <a
                href={shopSettings.socialLinks?.telegram || 'https://t.me'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#229ED9] text-white flex items-center justify-center font-bold text-xs hover:scale-110 transition-transform shadow-md"
                aria-label="Telegram"
              >
                ✈
              </a>
            </div>

          </div>

          {/* Column 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3.5 text-left">
            <h4 className="text-sm font-bold text-white tracking-wide">Quick Links</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('home')}
                  className="hover:text-orange-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="text-orange-500">•</span>
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('tools')}
                  className="hover:text-orange-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="text-orange-500">•</span>
                  <span>All Tools</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('services')}
                  className="hover:text-orange-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="text-orange-500">•</span>
                  <span>Cyber Cafe Services</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('govt')}
                  className="hover:text-orange-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="text-orange-500">•</span>
                  <span>Govt & Jobs</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('contact')}
                  className="hover:text-orange-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="text-orange-500">•</span>
                  <span>Contact Us</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Popular Tools (2 cols) */}
          <div className="lg:col-span-2 space-y-3.5 text-left">
            <h4 className="text-sm font-bold text-white tracking-wide">Popular Tools</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              {[
                { label: 'Passport Photo Maker', id: 'passport-photo-maker' },
                { label: 'Compress to 50KB', id: 'compress-to-50kb' },
                { label: 'Image to PDF', id: 'image-to-pdf' },
                { label: 'Background Remove', id: 'background-remove' },
                { label: 'Image to Text (OCR)', id: 'image-to-text-ocr' },
              ].map((tool) => (
                <li key={tool.label}>
                  <button
                    type="button"
                    onClick={() => handleLaunchTool(tool.id)}
                    className="hover:text-orange-400 transition-colors flex items-center gap-1.5 text-left cursor-pointer"
                  >
                    <span className="text-orange-500">•</span>
                    <span>{tool.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Support (2 cols) */}
          <div className="lg:col-span-2 space-y-3.5 text-left">
            <h4 className="text-sm font-bold text-white tracking-wide">Support</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('privacy')}
                  className="hover:text-orange-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="text-orange-500">•</span>
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('terms')}
                  className="hover:text-orange-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="text-orange-500">•</span>
                  <span>Terms of Service</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('about')}
                  className="hover:text-orange-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="text-orange-500">•</span>
                  <span>Disclaimer</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('pricing')}
                  className="hover:text-orange-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="text-orange-500">•</span>
                  <span>FAQ</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('contact')}
                  className="hover:text-orange-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="text-orange-500">•</span>
                  <span>Feedback</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Get Updates (2 cols) */}
          <div className="lg:col-span-2 space-y-3 text-left">
            <h4 className="text-sm font-bold text-white tracking-wide">Get Updates</h4>
            <p className="text-xs text-slate-400">
              नए टूल और सेवाओं की जानकारी पाएं
            </p>

            <form onSubmit={handleNewsletterSubmit} className="relative pt-1">
              <div className="flex items-center rounded-xl bg-[#0B1320] border border-slate-700/80 p-1 pl-3 focus-within:border-orange-500 transition-colors">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-8 h-8 rounded-lg bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shrink-0 cursor-pointer shadow-md transition-all ml-1"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              {subscribed && (
                <div className="text-[11px] text-emerald-400 font-bold mt-1">
                  ✓ धन्यवाद! आप सब्सक्राइब हो गए हैं।
                </div>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Copyright & Made with Love Strip matching screenshot */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 pt-6">
          <p>© 2026 MERAJ CAFE POINT. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Made with <span className="text-red-500">❤️</span> for India</span>
            <span>|</span>
            <span>Madhubani, Bihar 🇮🇳</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
