import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  CheckCircle2, 
  Sparkles, 
  Printer, 
  FileText, 
  ShieldCheck, 
  Clock, 
  MessageCircle,
  HelpCircle,
  PhoneCall
} from 'lucide-react';

export const Pricing: React.FC = () => {
  const { language, shopSettings, setActiveTab, setSelectedToolId } = useApp();

  const cafeRates = [
    {
      serviceEn: 'B&W Photocopy / Xerox',
      serviceHi: 'ब्लैक एंड व्हाइट ज़ेरॉक्स / फोटोकॉपी',
      rateEn: '₹2 / page',
      rateHi: '₹2 / पेज',
      descEn: 'Single or double-sided 75 GSM crisp laser copying',
      descHi: 'साफ सुथरी लेजर कॉपी (सिंगल या डबल साइड)',
      icon: <Printer className="w-5 h-5 text-blue-500" />
    },
    {
      serviceEn: 'Color Laser Printing',
      serviceHi: 'रंगीन लेजर प्रिंटिंग',
      rateEn: '₹10 / page',
      rateHi: '₹10 / पेज',
      descEn: 'Vibrant color print on smooth 80 GSM paper',
      descHi: 'हाई क्वालिटी रंगीन प्रिंट (डॉक्यूमेंट, प्रोजेक्ट, मार्कशीट)',
      icon: <FileText className="w-5 h-5 text-emerald-500" />
    },
    {
      serviceEn: 'Glossy Passport Photos (8 Pcs)',
      serviceHi: 'पासपोर्ट साइज फोटो (8 पीस ग्लॉसी)',
      rateEn: '₹50 / sheet',
      rateHi: '₹50 / शीट (8 फोटो)',
      descEn: 'Waterproof 240 GSM Kodak paper with machine cutting',
      descHi: 'कोडक ग्लॉसी पेपर, 300 DPI, कट मार्क्स के साथ',
      icon: <Sparkles className="w-5 h-5 text-orange-500" />
    },
    {
      serviceEn: 'A4 Document Lamination',
      serviceHi: 'A4 दस्तावेज लेमिनेशन',
      rateEn: '₹20 / document',
      rateHi: '₹20 / दस्तावेज',
      descEn: 'Thick 125 micron waterproof thermal pouch',
      descHi: 'मोटा वॉटरप्रूफ 125 माइक्रोन हीट लेमिनेशन',
      icon: <ShieldCheck className="w-5 h-5 text-amber-500" />
    },
    {
      serviceEn: 'Online Exam Form Application',
      serviceHi: 'ऑनलाइन सरकारी फॉर्म आवेदन',
      rateEn: '₹50 - ₹100',
      rateHi: '₹50 - ₹100',
      descEn: 'Error-free form filling with photo/signature resize',
      descHi: 'सटीक फॉर्म भरना, फोटो-सिग्नेचर रीसाइज और फाइनल प्रिंट',
      icon: <Clock className="w-5 h-5 text-purple-500" />
    },
    {
      serviceEn: 'PVC Plastic Smart Card (Aadhaar/PAN)',
      serviceHi: 'PVC प्लास्टिक स्मार्ट कार्ड प्रिंट',
      rateEn: '₹50 / card',
      rateHi: '₹50 / कार्ड',
      descEn: 'Original quality waterproof ATM-like plastic card',
      descHi: 'ATM जैसा मजबूत वॉटरप्रूफ प्लास्टिक कार्ड प्रिंट',
      icon: <Sparkles className="w-5 h-5 text-cyan-500" />
    },
  ];

  const handleWhatsAppContact = () => {
    const text = encodeURIComponent(
      language === 'hi'
        ? 'नमस्ते मेराज कैफे पॉइंट! मुझे प्रिंटिंग / ऑनलाइन सेवा के रेट और ऑर्डर के बारे में जानकारी चाहिए।'
        : 'Hello Meraj Cafe Point! I want inquiry regarding printing and cyber cafe services.'
    );
    window.open(`https://wa.me/91${shopSettings.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400 text-xs font-bold shadow-sm">
          <Sparkles className="w-4 h-4" />
          <span>{language === 'hi' ? 'पारदर्शी दरें एवं 100% मुफ्त ऑनलाइन टूल्स' : 'Transparent Pricing & Free Tools'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          {language === 'hi' ? (
            <>
              सस्ती सेवाएं एवं <span className="text-orange-500">100% फ्री टूल्स</span>
            </>
          ) : (
            <>
              Affordable Services & <span className="text-orange-500">100% Free Tools</span>
            </>
          )}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          {language === 'hi'
            ? 'हमारे सभी ऑनलाइन इमेज और PDF टूल्स हमेशा फ्री हैं। दुकान पर प्रिंटिंग और फॉर्म भरने की दरें नीचे दी गई हैं।'
            : 'All online tools are free forever with no limits. Offline cyber cafe printing and assistance rates are transparently listed below.'}
        </p>
      </div>

      {/* Free Online Tools Highlight Card */}
      <div className="neu-card p-6 sm:p-8 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/30 rounded-3xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-left">
            <span className="px-3 py-1 rounded-full bg-emerald-500 text-white font-black text-xs uppercase tracking-wider">
              {language === 'hi' ? 'हमेशा 100% फ्री' : 'Forever 100% Free'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {language === 'hi' ? 'सभी ऑनलाइन वेब टूल्स का उपयोग बिल्कुल मुफ्त है' : 'All Online Web Tools Are Completely Free'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> कोई लॉगिन जरूरी नहीं</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> कोई वाटरमार्क नहीं</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> असीमित फाइल्स प्रोसेस करें</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% सुरक्षित और प्राइवेट</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedToolId(null);
              setActiveTab('tools');
            }}
            className="neu-btn-orange px-6 py-3.5 rounded-full font-bold text-sm shrink-0 whitespace-nowrap cursor-pointer shadow-lg shadow-orange-500/30 hover:scale-105 transition-all"
          >
            {language === 'hi' ? 'टूल्स का इस्तेमाल करें ->' : 'Explore All Tools ->'}
          </button>
        </div>
      </div>

      {/* Offline Cyber Cafe Rate List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {language === 'hi' ? 'साइबर कैफे रेट लिस्ट (दुकान की सेवाएं)' : 'Cyber Cafe In-Shop Rate Card'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {language === 'hi' ? 'स्थान: मधुबनी, बिहार • बिना किसी छुपे शुल्क के' : 'Location: Madhubani, Bihar • Transparent & Fair Pricing'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleWhatsAppContact}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'hi' ? 'व्हाट्सएप पर ऑर्डर करें' : 'Order via WhatsApp'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cafeRates.map((item, idx) => (
            <div 
              key={idx}
              className="neu-card p-5 space-y-3 flex flex-col justify-between hover:-translate-y-1 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <span className="text-base sm:text-lg font-black text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 px-3 py-1 rounded-xl">
                    {language === 'hi' ? item.rateHi : item.rateEn}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {language === 'hi' ? item.serviceHi : item.serviceEn}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'hi' ? item.descHi : item.descEn}
                </p>
              </div>

              <button
                type="button"
                onClick={handleWhatsAppContact}
                className="w-full py-2 px-3 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-orange-500 hover:text-orange-600 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>{language === 'hi' ? 'ऑर्डर / पूछताछ करें' : 'Inquire / Order'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Support Box */}
      <div className="neu-card p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {language === 'hi' ? 'थोक प्रिंटिंग या विशेष काम के लिए संपर्क करें' : 'Bulk Printing or Special Inquiries'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'hi' ? 'फोन / व्हाट्सएप: 9060776981 • मधुबनी, बिहार' : 'Phone / WhatsApp: 9060776981 • Madhubani, Bihar'}
            </p>
          </div>
        </div>
        <a
          href={`tel:91${shopSettings.phone}`}
          className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 text-xs font-bold shadow-md transition-all whitespace-nowrap"
        >
          {language === 'hi' ? 'कॉल करें (9060776981)' : 'Call Now (9060776981)'}
        </a>
      </div>

    </div>
  );
};
