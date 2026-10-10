import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Phone, MessageCircle } from 'lucide-react';

export const FloatingActions: React.FC = () => {
  const { shopSettings, language } = useApp();

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-3 sm:bottom-6 sm:right-6 pointer-events-none">
      {/* Call Button */}
      <a
        href={`tel:${shopSettings.phone}`}
        className="pointer-events-auto flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full neu-btn text-slate-800 dark:text-slate-100 hover:scale-105 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 shadow-[6px_6px_14px_rgba(203,213,225,0.7),-6px_-6px_14px_rgba(255,255,255,0.9)] dark:shadow-[6px_6px_14px_rgba(0,0,0,0.8),-4px_-4px_10px_rgba(255,255,255,0.06)]"
        title="Call Meraj Cafe Point"
        aria-label="Call Meraj Cafe Point"
      >
        <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
      </a>

      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/91${shopSettings.whatsapp}?text=${encodeURIComponent(
          language === 'hi'
            ? 'नमस्ते मेराज कैफे पॉइंट, मुझे ऑनलाइन सर्विस / प्रिंटिंग के संबंध में जानकारी चाहिए।'
            : 'Hello Meraj Cafe Point, I need assistance regarding online services / printing.'
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full neu-btn-emerald text-white hover:scale-105 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 shadow-[6px_6px_16px_rgba(5,150,105,0.45),-5px_-5px_12px_rgba(255,255,255,0.7)] dark:shadow-[6px_6px_16px_rgba(0,0,0,0.8),-3px_-3px_8px_rgba(16,185,129,0.3)]"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
      </a>
    </div>
  );
};
