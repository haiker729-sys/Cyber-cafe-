import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { GOVT_PORTALS } from '../data/mockData.ts';
import { 
  ExternalLink, 
  ShieldCheck, 
  Search, 
  HelpCircle, 
  Building2, 
  GraduationCap, 
  FileText, 
  MessageCircle 
} from 'lucide-react';

export const GovtJobs: React.FC = () => {
  const { language, shopSettings } = useApp();
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filteredPortals = GOVT_PORTALS.filter((p) => {
    const matchesCat = filter === 'all' || p.category === filter;
    const q = search.toLowerCase().trim();
    const matchesQ =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.titleHi.toLowerCase().includes(q) ||
      p.portalName.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);
    return matchesCat && matchesQ;
  });

  const handleHelpClick = (portalTitle: string) => {
    const text = encodeURIComponent(
      language === 'hi'
        ? `नमस्ते मेराज कैफे पॉइंट, मुझे "${portalTitle}" के ऑनलाइन फॉर्म / एडमिट कार्ड के संबंध में आवेदन सहायता चाहिए।`
        : `Hello Meraj Cafe Point, I need application assistance for "${portalTitle}".`
    );
    window.open(`https://wa.me/91${shopSettings.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {language === 'hi' ? 'सरकारी नौकरी एवं आधिकारिक पोर्टल्स' : 'Government & Official Exam Portals'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          {language === 'hi'
            ? 'बिहार एवं केंद्र सरकार के सत्यापित आधिकारिक वेबसाइट लिंक। फर्जी वेबसाइटों से सावधान रहें।'
            : 'Verified official government website links for jobs, admit cards, and state services.'}
        </p>
      </div>

      {/* Mandatory Official Disclaimer */}
      <div className="rounded-2xl neu-card p-5 sm:p-6 flex flex-col sm:flex-row items-start gap-4 text-xs text-slate-800 dark:text-slate-200">
        <div className="w-10 h-10 rounded-xl neu-icon shrink-0">
          <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="space-y-1.5 leading-relaxed">
          <p className="font-bold text-sm text-slate-900 dark:text-white">
            {language === 'hi' ? 'महत्वपूर्ण अस्वीकरण (Official Disclaimer):' : 'Official Disclaimer:'}
          </p>
          <p className="text-slate-600 dark:text-slate-400">
            {language === 'hi'
              ? 'यह वेबसाइट किसी भी सरकारी संस्था, आयोग या विभाग का आधिकारिक पोर्टल नहीं है। यहाँ केवल उम्मीदवारों की सुविधा के लिए आधिकारिक सरकारी वेबसाइटों के सत्यापित लिंक प्रदान किए गए हैं। मेराज कैफे पॉइंट केवल फॉर्म भरने में तकनीकी सहायता प्रदान करता है।'
              : 'This is not an official government website. We provide links only to verified official portals for candidate convenience. Meraj Cafe Point provides application filling assistance only; exam conduction and result declarations are solely handled by respective government authorities.'}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80 neu-inset">
          <Search className="w-4 h-4 text-orange-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'hi' ? 'पोर्टल खोजें (BPSC, SSC, RTPS)...' : 'Search official portals (BPSC, SSC, RTPS)...'}
            className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-2xl neu-inset-sm overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', labelEn: 'All Portals', labelHi: 'सभी' },
            { id: 'bihar_gov', labelEn: 'Bihar Govt', labelHi: 'बिहार सरकार' },
            { id: 'jobs', labelEn: 'Central Jobs (SSC/RRB)', labelHi: 'केंद्रीय भर्ती' },
            { id: 'certificates', labelEn: 'RTPS / E-Services', labelHi: 'ई-सेवाएं' },
            { id: 'results', labelEn: 'Board & Results', labelHi: 'रिजल्ट पोर्टल' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all min-h-[36px] ${
                filter === c.id
                  ? 'neu-tab-active bg-[#E8EDF5] dark:bg-[#1B1E27] text-orange-600 dark:text-orange-400'
                  : 'neu-tab-idle'
              }`}
            >
              {language === 'hi' ? c.labelHi : c.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Portals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPortals.map((portal) => (
          <div
            key={portal.id}
            className="rounded-2xl neu-card-hover p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Official Link</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  .gov.in / .nic.in
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {language === 'hi' ? portal.titleHi : portal.title}
              </h3>

              <div className="text-xs text-orange-600 dark:text-orange-400 font-semibold mt-1">
                {portal.portalName}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
                {language === 'hi' ? portal.descriptionHi : portal.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800 flex items-center gap-2">
              <a
                href={portal.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 neu-btn text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <span>Visit Official Site</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <button
                type="button"
                onClick={() => handleHelpClick(language === 'hi' ? portal.titleHi : portal.title)}
                className="py-2.5 px-3 neu-btn-emerald text-white font-bold text-xs flex items-center justify-center gap-1.5 min-h-[44px]"
                title="Get Form Filling Assistance"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'फॉर्म सहायता' : 'Get Help'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
