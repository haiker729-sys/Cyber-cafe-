import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { CAFE_SERVICES } from '../data/mockData.ts';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  MessageCircle, 
  Search, 
  HelpCircle,
  FileCheck2,
  ExternalLink
} from 'lucide-react';

export const Services: React.FC = () => {
  const { language, shopSettings, setActiveTab, setSelectedToolId } = useApp();
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filteredServices = CAFE_SERVICES.filter((s) => {
    const matchesFilter = filter === 'all' || s.category === filter;
    const q = search.toLowerCase().trim();
    const matchesQ =
      !q ||
      s.title.toLowerCase().includes(q) ||
      s.titleHi.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.descriptionHi.toLowerCase().includes(q);
    return matchesFilter && matchesQ;
  });

  const handleWhatsAppInquiry = (serviceTitle: string) => {
    const text = encodeURIComponent(
      language === 'hi'
        ? `नमस्ते मेराज कैफे पॉइंट, मुझे "${serviceTitle}" सेवा के संबंध में आवेदन करवाना है। कृपया शुल्क और आवश्यक दस्तावेज बताएं।`
        : `Hello Meraj Cafe Point, I want to apply for "${serviceTitle}". Please share the charges and required documents.`
    );
    window.open(`https://wa.me/91${shopSettings.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {language === 'hi' ? 'साइबर कैफे एवं ऑनलाइन सेवाएं' : 'Cyber Cafe & Online Services'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          {language === 'hi'
            ? 'पैन कार्ड, RTPS प्रमाण पत्र, छात्रवृत्ति, एडमिट कार्ड और सरकारी फॉर्म भरने में विश्वसनीय पेशेवर सहायता।'
            : 'Assistance for PAN cards, Bihar RTPS certificates, exam forms, scholarships, and laser printing.'}
        </p>
      </div>

      {/* Notice about Application Assistance vs Official Body */}
      <div className="rounded-2xl neu-card p-4 sm:p-5 text-xs text-orange-950 dark:text-orange-200 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl neu-icon shrink-0 mt-0.5">
          <HelpCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
        </div>
        <div className="leading-relaxed">
          <span className="font-bold">
            {language === 'hi' ? 'आवेदन सहायता प्रक्रिया: ' : 'Application Assistance Notice: '}
          </span>
          {language === 'hi'
            ? 'मेराज कैफे पॉइंट नागरिकों को आधिकारिक सरकारी पोर्टल्स पर फॉर्म भरने और दस्तावेज सही फॉर्मेट में अपलोड करने में सहायता करता है। प्रमाण पत्र जारी करने का अधिकार संबंधित सरकारी विभाग के पास होता है।'
            : 'Meraj Cafe Point assists candidates in filling forms on official government portals. We do not issue government certificates directly.'}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80 neu-inset">
          <Search className="w-4 h-4 text-orange-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'hi' ? 'सेवाएं खोजें (जैसे: पैन कार्ड, RTPS)...' : 'Search services (e.g. PAN, RTPS)...'}
            className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-2xl neu-inset-sm overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', labelEn: 'All Services', labelHi: 'सभी' },
            { id: 'gov_form', labelEn: 'RTPS & Forms', labelHi: 'RTPS व प्रमाण पत्र' },
            { id: 'id_services', labelEn: 'PAN & Voter ID', labelHi: 'पैन व वोटर ID' },
            { id: 'education', labelEn: 'Scholarship', labelHi: 'छात्रवृत्ति' },
            { id: 'printing', labelEn: 'Printing & Xerox', labelHi: 'प्रिंटिंग' },
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

      {/* Services Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="rounded-2xl neu-card-hover p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                  {service.category.replace('_', ' ')}
                </span>
                
                {/* Price Tag: Show price if set in admin, otherwise 'Ask on WhatsApp' */}
                {service.price ? (
                  <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg neu-inset-sm text-orange-950 dark:text-orange-300">
                    ₹{service.price}
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {language === 'hi' ? 'व्हाट्सएप पर पूछें' : 'Ask on WhatsApp'}
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                {language === 'hi' ? service.titleHi : service.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                {language === 'hi' ? service.descriptionHi : service.description}
              </p>

              {/* Turnaround Time */}
              <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span>{language === 'hi' ? service.turnaroundHi : service.turnaround}</span>
              </div>

              {/* Required Documents Checklist */}
              <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
                  {language === 'hi' ? 'आवश्यक दस्तावेज:' : 'Required Documents:'}
                </span>
                <ul className="space-y-1">
                  {(language === 'hi' ? service.requirementsHi : service.requirements).map((req, i) => (
                    <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                      <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action CTA */}
            <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800 flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleWhatsAppInquiry(language === 'hi' ? service.titleHi : service.title)}
                className="flex-1 py-2.5 neu-btn-emerald text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 min-h-[44px]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{language === 'hi' ? 'व्हाट्सएप पर संपर्क करें' : 'Inquire on WhatsApp'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('contact')}
                className="p-2.5 neu-btn text-slate-700 dark:text-slate-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Contact Info"
              >
                <FileCheck2 className="w-4 h-4 text-orange-500" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
