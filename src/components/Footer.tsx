import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  Home, 
  Layers, 
  Sparkles, 
  Briefcase, 
  PhoneCall, 
  MessageCircle, 
  Phone, 
  MapPin, 
  ShieldCheck 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, shopSettings, setActiveTab, setSelectedToolId } = useApp();

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

  return (
    <footer className="bg-[#0B132B] text-slate-300 pt-16 pb-12 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Column 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              {/* Orange Ribbon M Emblem */}
              <div className="w-10 h-10 rounded-xl bg-transparent flex items-center justify-center shrink-0">
                <svg className="w-9 h-9" viewBox="0 0 44 44" fill="none">
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
                <span className="text-[11px] font-semibold text-slate-400 block mt-1 tracking-wider uppercase">
                  Online Tools • Cyber Cafe • Digital Services
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed pr-4">
              {language === 'hi'
                ? 'आपके डिजिटल काम के लिए एक भरोसेमंद और आसान प्लेटफार्म। फोटो, इमेज, PDF और सरकारी सेवाओं के लिए सभी टूल एक ही जगह पर।'
                : 'A reliable and easy platform for all your digital tasks. Image, photo, PDF tools, and government assistance all in one place.'}
            </p>
          </div>

          {/* Column 2: Quick Links (2.5 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-base font-bold text-white tracking-wide">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('home')}
                  className="flex items-center gap-2.5 text-slate-300 hover:text-orange-400 transition-colors"
                >
                  <Home className="w-4 h-4 text-slate-400" />
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('tools')}
                  className="flex items-center gap-2.5 text-slate-300 hover:text-orange-400 transition-colors"
                >
                  <Layers className="w-4 h-4 text-slate-400" />
                  <span>All Tools</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('services')}
                  className="flex items-center gap-2.5 text-slate-300 hover:text-orange-400 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-slate-400" />
                  <span>Cyber Cafe</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('govt')}
                  className="flex items-center gap-2.5 text-slate-300 hover:text-orange-400 transition-colors"
                >
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  <span>Govt & Jobs</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('contact')}
                  className="flex items-center gap-2.5 text-slate-300 hover:text-orange-400 transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-slate-400" />
                  <span>Contact Us</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Popular Tools (2.5 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-base font-bold text-white tracking-wide">Popular Tools</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Passport Photo Maker', id: 'passport-photo' },
                { label: 'Compress to 50KB', id: 'compress-image' },
                { label: 'Image to PDF', id: 'pdf-merge' },
                { label: 'Background Remove', id: 'passport-photo' },
                { label: 'Image to Text (OCR)', id: 'convert-image' },
              ].map((tool) => (
                <li key={tool.label}>
                  <button
                    type="button"
                    onClick={() => handleLaunchTool(tool.id)}
                    className="text-slate-300 hover:text-orange-400 transition-colors text-left flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                    <span>{tool.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Buttons & Address (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-base font-bold text-white tracking-wide">Contact</h4>
            
            <div className="space-y-3">
              {/* WhatsApp Pill Button */}
              <a
                href={`https://wa.me/91${shopSettings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-2xl bg-[#112233] border border-emerald-500/40 hover:border-emerald-400 flex items-center gap-3 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                  <MessageCircle className="w-5 h-5 fill-white text-emerald-500" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-emerald-400 block leading-tight">WhatsApp</span>
                  <span className="text-sm font-bold text-white font-mono">{shopSettings.whatsapp}</span>
                </div>
              </a>

              {/* Call Now Pill Button */}
              <a
                href={`tel:${shopSettings.phone}`}
                className="w-full py-3 px-4 rounded-2xl bg-[#112233] border border-orange-500/40 hover:border-orange-400 flex items-center gap-3 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-orange-400 block leading-tight">Call Now</span>
                  <span className="text-sm font-bold text-white font-mono">{shopSettings.phone}</span>
                </div>
              </a>

              {/* Location Pin */}
              <a
                href={shopSettings.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-slate-300 hover:text-white transition-colors pt-1"
              >
                <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                <span>{shopSettings.address || 'Madhubani, Bihar, India'}</span>
              </a>
            </div>

          </div>

        </div>

        {/* Disclaimer Strip */}
        <div className="py-4 text-xs text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0" />
          <p>
            Official Notice: This is an independent cyber cafe portal providing digital tools and online service assistance in Bihar.
          </p>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 pt-4 border-t border-slate-800/80">
          <p>© {new Date().getFullYear()} MERAJ CAFE POINT. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <button type="button" onClick={() => handleNav('privacy')} className="hover:text-white transition-colors">
              Privacy Policy
            </button>
            <span>|</span>
            <button type="button" onClick={() => handleNav('terms')} className="hover:text-white transition-colors">
              Terms of Service
            </button>
            <span>|</span>
            <button type="button" onClick={() => handleNav('about')} className="hover:text-white transition-colors">
              Disclaimer
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
