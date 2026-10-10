import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  Home as HomeIcon,
  Sun, 
  Moon, 
  Menu, 
  X, 
  FileCheck,
  ShieldAlert,
  Layers,
  Briefcase,
  PhoneCall,
  Sparkles
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    language, 
    toggleLanguage, 
    theme, 
    toggleTheme, 
    activeTab, 
    setActiveTab,
    setSelectedToolId,
    userRole
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', labelEn: 'Home', labelHi: 'होम', icon: <HomeIcon className="w-4 h-4" /> },
    { id: 'tools', labelEn: 'All Tools', labelHi: 'सभी टूल्स', icon: <Layers className="w-4 h-4" /> },
    { id: 'services', labelEn: 'Cyber Cafe', labelHi: 'साइबर कैफे', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'govt', labelEn: 'Govt & Jobs', labelHi: 'सरकारी नौकरी', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'contact', labelEn: 'Contact', labelHi: 'संपर्क', icon: <PhoneCall className="w-4 h-4" /> },
  ];

  const handleNav = (tabId: string) => {
    setActiveTab(tabId);
    setSelectedToolId(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F1F5F9]/95 dark:bg-[#0B0F19]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* 1. BRAND LOGO (Exact stylized orange 'M' ribbon from screenshot) */}
        <button
          onClick={() => handleNav('home')}
          className="flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-xl shrink-0 group cursor-pointer"
        >
          {/* Orange Ribbon Origami 'M' Emblem */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-transparent flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <svg 
              className="w-9 h-9 sm:w-10 sm:h-10 drop-shadow-sm" 
              viewBox="0 0 44 44" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Left loop of the M */}
              <path 
                d="M6 32V15C6 11.5 9 9 12.5 10.5L20 16L12 28L6 32Z" 
                fill="#EA580C" 
              />
              <path 
                d="M12.5 10.5C16 12 18.5 15.5 22 20.5L14 33L6 32L12.5 10.5Z" 
                fill="#F97316" 
              />
              {/* Right loop of the M */}
              <path 
                d="M38 32V15C38 11.5 35 9 31.5 10.5L24 16L32 28L38 32Z" 
                fill="#EA580C" 
              />
              <path 
                d="M31.5 10.5C28 12 25.5 15.5 22 20.5L30 33L38 32L31.5 10.5Z" 
                fill="#FB923C" 
              />
              {/* Center connector arch */}
              <circle cx="22" cy="18" r="4.5" fill="#F97316" />
              <path d="M17.5 18C17.5 15.5 19.5 13.5 22 13.5C24.5 13.5 26.5 15.5 26.5 18L22 23L17.5 18Z" fill="#C2410C" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-lg sm:text-xl font-black tracking-tight text-orange-500">
                MERAJ
              </span>
              <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
                CAFE POINT
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mt-1 tracking-wider uppercase">
              Online Tools • Cyber Cafe • Digital Services
            </span>
          </div>
        </button>

        {/* 2. NAVIGATION PILLS (Exact design with active Orange Pill) */}
        <nav className="hidden lg:flex items-center gap-1.5 px-2 py-1.5 rounded-full bg-slate-200/50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 shadow-inner">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`transition-all whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/30'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/50'
                }`}
              >
                {item.id === 'home' && <HomeIcon className="w-4 h-4 shrink-0" />}
                <span>{language === 'hi' ? item.labelHi : item.labelEn}</span>
              </button>
            );
          })}
        </nav>

        {/* 3. RIGHT CONTROLS: Language Pill, Sun/Moon Switch, Mobile Menu */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          
          {/* Language Toggle Pill: हिंदी | EN */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center p-1 rounded-full bg-slate-200/60 dark:bg-slate-800/80 border border-slate-300/70 dark:border-slate-700 text-xs font-bold transition-all shadow-sm cursor-pointer"
            title="Switch Language / भाषा बदलें"
            aria-label="Toggle Language"
          >
            <span 
              className={`px-2.5 py-1 rounded-full transition-all ${
                language === 'hi'
                  ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              हिंदी
            </span>
            <span className="text-slate-400 dark:text-slate-600 px-0.5">|</span>
            <span 
              className={`px-2.5 py-1 rounded-full transition-all ${
                language === 'en'
                  ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              EN
            </span>
          </button>

          {/* Theme Dual Pill Switch: Sun & Moon */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center p-1 rounded-full bg-slate-200/60 dark:bg-slate-800/80 border border-slate-300/70 dark:border-slate-700 shadow-sm transition-all cursor-pointer"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            aria-label="Toggle Light and Dark Theme"
          >
            <div 
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                theme === 'light' 
                  ? 'bg-amber-400 text-amber-950 shadow-sm' 
                  : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              <Sun className="w-4 h-4" />
            </div>
            <div 
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                theme === 'dark' 
                  ? 'bg-slate-900 text-amber-300 shadow-sm' 
                  : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              <Moon className="w-4 h-4" />
            </div>
          </button>

          {/* Track Application Quick Button (Desktop) */}
          <button
            type="button"
            onClick={() => handleNav('status')}
            className="hidden xl:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-orange-500 shadow-sm cursor-pointer transition-all"
          >
            <FileCheck className="w-4 h-4 text-orange-500" />
            <span>{language === 'hi' ? 'आवेदन स्थिति' : 'Track Status'}</span>
          </button>

          {/* Admin / Portal Trigger */}
          <button
            type="button"
            onClick={() => handleNav('admin')}
            className={`p-2.5 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
              userRole !== 'guest' || activeTab === 'admin'
                ? 'border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/25'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-orange-500 shadow-sm'
            }`}
            title="Admin & Staff Portal"
            aria-label="Admin Portal"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>

          {/* Mobile Menu Hamburger (Rounded Square Icon) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm flex items-center justify-center cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-orange-500" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121927] px-4 pt-3 pb-6 shadow-2xl space-y-3">
          
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/25'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{language === 'hi' ? item.labelHi : item.labelEn}</span>
                </div>
                {activeTab === item.id && <span className="w-2 h-2 rounded-full bg-white" />}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
            <button
              type="button"
              onClick={() => handleNav('status')}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-500/30"
            >
              <FileCheck className="w-4 h-4" />
              <span>{language === 'hi' ? 'आवेदन स्थिति ट्रैक करें' : 'Track Application'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleNav('admin')}
              className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4 text-orange-500" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
