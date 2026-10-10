import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Flame, 
  Image as ImageIcon, 
  FileText, 
  UserCheck, 
  Layers, 
  RefreshCw, 
  Maximize2, 
  Sparkles, 
  Share2, 
  Camera, 
  Scissors, 
  Sliders, 
  PenTool, 
  ScanLine, 
  Feather, 
  Grid, 
  RotateCw, 
  FilePlus, 
  FileX, 
  Lock, 
  Zap, 
  ShieldCheck, 
  CloudOff, 
  Instagram, 
  MessageCircle,
  Minimize2,
  ChevronRight,
  Printer
} from 'lucide-react';

export const Home: React.FC = () => {
  const { 
    language, 
    setActiveTab, 
    setSelectedToolId 
  } = useApp();

  const [search, setSearch] = useState('');

  const handleLaunchTool = (id: string) => {
    setSelectedToolId(id);
    setActiveTab('tools');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      setActiveTab('tools');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      
      {/* =========================================================================
          1. HERO SECTION: Title, Subtitle, 4 Badges & 3D Illustrated Floating Cards
          ========================================================================= */}
      <section className="pt-8 sm:pt-14 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.18]">
                {language === 'hi' ? (
                  <>
                    फोटो, इमेज और PDF के सभी टूल{' '}
                    <span className="text-orange-500 underline decoration-orange-400/40 decoration-wavy decoration-2">
                      एक जगह
                    </span>
                  </>
                ) : (
                  <>
                    All Your Image & PDF Tools –{' '}
                    <span className="text-orange-500">Fast, Free & Easy</span>
                  </>
                )}
              </h1>

              <p className="text-base sm:text-xl font-medium text-slate-600 dark:text-slate-300">
                {language === 'hi'
                  ? 'All Your Image & PDF Tools - Fast, Free & Easy'
                  : 'Complete cyber cafe suite: Compress, Resize, Merge, Split, Convert & Print in one place.'}
              </p>

              {/* 4 Feature Badges in Row */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {[
                  { labelEn: '100% Free Tools', labelHi: '100% Free Tools' },
                  { labelEn: 'No Software Needed', labelHi: 'No Software Needed' },
                  { labelEn: 'Fast Processing', labelHi: 'Fast Processing' },
                  { labelEn: 'Safe & Secure', labelHi: 'Safe & Secure' },
                ].map((badge, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-sm text-xs font-bold text-slate-700 dark:text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{badge.labelHi}</span>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Hero: 3D Illustration Graphic Matching the Screenshot */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              
              {/* Soft glow background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-400/15 via-sky-400/10 to-transparent blur-3xl -z-10 rounded-full" />

              <div className="relative w-full max-w-md py-4">
                
                {/* Center Big Photo Card */}
                <div className="relative bg-white dark:bg-[#1E2738] rounded-3xl p-4 shadow-2xl border border-white dark:border-slate-700 max-w-[280px] sm:max-w-[310px] mx-auto transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                  <div className="aspect-[4/3] rounded-2xl bg-gradient-to-tr from-sky-400 via-sky-200 to-amber-100 dark:from-slate-800 dark:via-sky-900 dark:to-orange-950 p-4 flex flex-col justify-between overflow-hidden relative shadow-inner">
                    {/* Sun */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-300 to-orange-500 shadow-md ml-auto" />
                    {/* Stylized Mountains */}
                    <div className="flex items-end justify-between -mb-4 -mx-4">
                      <div className="w-28 h-20 bg-sky-600/30 rounded-t-full transform translate-x-4" />
                      <div className="w-36 h-24 bg-sky-700/40 rounded-t-full" />
                    </div>
                  </div>
                </div>

                {/* Floating Badge 1: JPG (Orange) */}
                <div className="absolute -top-1 left-2 sm:left-4 px-4 py-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-sm shadow-xl shadow-orange-500/30 flex items-center gap-1.5 animate-bounce">
                  <span>JPG</span>
                </div>

                {/* Floating Badge 2: PNG (Sky Blue) */}
                <div className="absolute -top-3 right-16 sm:right-20 px-4 py-1.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-black text-xs shadow-xl shadow-sky-500/30 flex items-center gap-1">
                  <span>PNG</span>
                </div>

                {/* Floating Badge 3: PDF (Red/Coral) */}
                <div className="absolute bottom-4 right-14 sm:right-16 px-4 py-2 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-black text-sm shadow-xl shadow-red-500/30 flex items-center gap-1.5">
                  <span>PDF</span>
                </div>

                {/* Curved orange swoosh arrow representation */}
                <svg className="absolute -top-4 right-8 w-24 h-16 text-orange-500 overflow-visible" fill="none" viewBox="0 0 100 60">
                  <path d="M 10 40 Q 50 5 90 20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray="3 3" />
                  <polygon points="90,15 96,22 88,27" fill="currentColor" />
                </svg>

                {/* Floating Right Card with Checkmarks (Exact from Screenshot) */}
                <div className="absolute top-1/2 -right-2 sm:-right-4 -translate-y-1/2 bg-white dark:bg-[#1E2738] rounded-2xl p-4 shadow-xl border border-slate-100 dark:border-slate-700 space-y-2.5 min-w-[130px]">
                  {[
                    'तेज',
                    'सरल',
                    'बिल्कुल मुफ्त',
                    'मोबाइल फ्रेंडली'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

              </div>

            </div>

          </div>

          {/* =========================================================================
              2. SEARCH BAR: Big rounded box with orange pill 'खोजें ->' button
              ========================================================================= */}
          <div className="mt-10 sm:mt-14 max-w-4xl mx-auto space-y-4">
            
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="flex items-center rounded-full bg-white dark:bg-[#151D2E] border border-slate-200 dark:border-slate-700/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-2 pl-6 transition-all focus-within:ring-2 focus-within:ring-orange-500">
                <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={
                    language === 'hi'
                      ? 'आपको कौन-सा टूल चाहिए? जैसे: passport photo, compress, image to pdf...'
                      : 'Which tool do you need? e.g., passport photo, compress, image to pdf...'
                  }
                  className="w-full bg-transparent text-sm sm:text-base font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="ml-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black text-sm sm:text-base shadow-lg shadow-orange-500/30 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
                >
                  <span>{language === 'hi' ? 'खोजें' : 'Search'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Popular Search Tags below Search Bar */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 font-bold px-2 py-1">
                <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                <span>Popular:</span>
              </div>
              {[
                { label: 'Passport Photo', id: 'passport-photo' },
                { label: 'Compress to 50KB', id: 'compress-image' },
                { label: 'Image to PDF', id: 'pdf-merge' },
                { label: 'Background Remove', id: 'passport-photo' },
                { label: 'Resize Image', id: 'resize-image' },
                { label: 'Image to Text', id: 'convert-image' },
              ].map((tag) => (
                <button
                  key={tag.label}
                  type="button"
                  onClick={() => handleLaunchTool(tag.id)}
                  className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-400 shadow-sm transition-all cursor-pointer"
                >
                  {tag.label}
                </button>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          3. TOP CATEGORY GRID: 8 Colorful Neumorphic Category Cards
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {[
            {
              id: 'image-tools',
              title: 'Image Tools',
              badge: '25+ Tools',
              badgeColor: 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300',
              iconBg: 'bg-orange-100 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400',
              icon: <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
              action: () => handleLaunchTool('compress-image'),
            },
            {
              id: 'pdf-tools',
              title: 'PDF Tools',
              badge: '20+ Tools',
              badgeColor: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300',
              iconBg: 'bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400',
              icon: <FileText className="w-5 h-5 sm:w-6 sm:h-6" />,
              action: () => handleLaunchTool('pdf-merge'),
            },
            {
              id: 'passport-id',
              title: 'Passport & ID',
              badge: '15+ Tools',
              badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
              iconBg: 'bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400',
              icon: <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />,
              action: () => handleLaunchTool('passport-photo'),
            },
            {
              id: 'compression',
              title: 'Compression',
              badge: '15+ Tools',
              badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
              iconBg: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
              icon: <Layers className="w-5 h-5 sm:w-6 sm:h-6" />,
              action: () => handleLaunchTool('compress-image'),
            },
            {
              id: 'format-convert',
              title: 'Format Convert',
              badge: '12+ Tools',
              badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
              iconBg: 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
              icon: <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6" />,
              action: () => handleLaunchTool('convert-image'),
            },
            {
              id: 'resize-tools',
              title: 'Resize Tools',
              badge: '20+ Tools',
              badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
              iconBg: 'bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
              icon: <Maximize2 className="w-5 h-5 sm:w-6 sm:h-6" />,
              action: () => handleLaunchTool('resize-image'),
            },
            {
              id: 'editing-effects',
              title: 'Editing & Effects',
              badge: '12+ Tools',
              badgeColor: 'bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300',
              iconBg: 'bg-violet-100 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400',
              icon: <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />,
              action: () => handleLaunchTool('passport-photo'),
            },
            {
              id: 'social-media',
              title: 'Social Media',
              badge: '8+ Tools',
              badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
              iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
              icon: <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />,
              action: () => handleLaunchTool('resize-image'),
            },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={cat.action}
              className="bg-white dark:bg-[#151D2E] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center justify-between text-center group cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-2xl ${cat.iconBg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm`}>
                {cat.icon}
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight mb-2">
                {cat.title}
              </span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${cat.badgeColor}`}>
                {cat.badge}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* =========================================================================
          4. 4 QUICK ACTION HIGHLIGHT CARDS (Exact wide cards from screenshot)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Action 1: Passport Photo Maker */}
          <button
            type="button"
            onClick={() => handleLaunchTool('passport-photo')}
            className="bg-white dark:bg-[#151D2E] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-orange-400 transition-all flex items-center justify-between gap-3 text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400 flex items-center justify-center shrink-0">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">
                  Passport Photo Maker
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  सभी सरकारी साइज में
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all shrink-0" />
          </button>

          {/* Action 2: Compress to 50KB */}
          <button
            type="button"
            onClick={() => handleLaunchTool('compress-image')}
            className="bg-white dark:bg-[#151D2E] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-orange-400 transition-all flex items-center justify-between gap-3 text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">
                  Compress to 50KB
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  आकार कम करें
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all shrink-0" />
          </button>

          {/* Action 3: Image to PDF */}
          <button
            type="button"
            onClick={() => handleLaunchTool('pdf-merge')}
            className="bg-white dark:bg-[#151D2E] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-orange-400 transition-all flex items-center justify-between gap-3 text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">
                  Image to PDF
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  इमेज को PDF में बदलें
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all shrink-0" />
          </button>

          {/* Action 4: Background Remove */}
          <button
            type="button"
            onClick={() => handleLaunchTool('passport-photo')}
            className="bg-white dark:bg-[#151D2E] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-orange-400 transition-all flex items-center justify-between gap-3 text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Scissors className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">
                  Background Remove
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  फोटो का बैकग्राउंड हटाएं
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all shrink-0" />
          </button>

        </div>
      </section>

      {/* =========================================================================
          5. IMAGE TOOLS SECTION (10 Tools in Grid with Header + 'सभी देखें ->')
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Header Strip */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/25 shrink-0">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Image Tools
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                फोटो से जुड़े सभी टूल – आसानी से, एक क्लिक में
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('tools')}
            className="px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-orange-500 hover:border-orange-500 shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>{language === 'hi' ? 'सभी देखें' : 'View All'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 10 Tools Grid (5 cols on desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {[
            { title: 'Passport Photo Maker', id: 'passport-photo', icon: <UserCheck className="w-5 h-5 text-purple-600" />, iconBg: 'bg-purple-100 dark:bg-purple-950/60' },
            { title: 'Reduce Image Size', id: 'compress-image', icon: <Minimize2 className="w-5 h-5 text-blue-600" />, iconBg: 'bg-blue-100 dark:bg-blue-950/60' },
            { title: 'Resize Image Pixel', id: 'resize-image', icon: <Sliders className="w-5 h-5 text-orange-600" />, iconBg: 'bg-orange-100 dark:bg-orange-950/60' },
            { title: 'Text to Handwriting', id: 'convert-image', icon: <PenTool className="w-5 h-5 text-pink-600" />, iconBg: 'bg-pink-100 dark:bg-pink-950/60' },
            { title: 'Image to Text (OCR)', id: 'convert-image', icon: <ScanLine className="w-5 h-5 text-cyan-600" />, iconBg: 'bg-cyan-100 dark:bg-cyan-950/60' },
            { title: 'Generate Signature', id: 'resize-image', icon: <Feather className="w-5 h-5 text-rose-600" />, iconBg: 'bg-rose-100 dark:bg-rose-950/60' },
            { title: 'Increase Image Size', id: 'resize-image', icon: <Maximize2 className="w-5 h-5 text-orange-600" />, iconBg: 'bg-orange-100 dark:bg-orange-950/60' },
            { title: 'AI Photo Enhancer', id: 'passport-photo', icon: <Sparkles className="w-5 h-5 text-purple-600" />, iconBg: 'bg-purple-100 dark:bg-purple-950/60' },
            { title: 'Photo Collage Maker', id: 'convert-image', icon: <Grid className="w-5 h-5 text-emerald-600" />, iconBg: 'bg-emerald-100 dark:bg-emerald-950/60' },
            { title: 'Resize Signature', id: 'resize-image', icon: <PenTool className="w-5 h-5 text-amber-600" />, iconBg: 'bg-amber-100 dark:bg-amber-950/60' },
          ].map((tool) => (
            <button
              key={tool.title}
              type="button"
              onClick={() => handleLaunchTool(tool.id)}
              className="bg-white dark:bg-[#151D2E] rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-orange-400 hover:-translate-y-0.5 transition-all flex items-center gap-3 text-left cursor-pointer group"
            >
              <div className={`w-10 h-10 rounded-xl ${tool.iconBg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                {tool.icon}
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-orange-500 transition-colors leading-tight">
                {tool.title}
              </span>
            </button>
          ))}
        </div>

      </section>

      {/* =========================================================================
          6. PDF TOOLS SECTION (10 Tools in Grid with Header + 'सभी देखें ->')
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Header Strip */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center shadow-md shadow-red-500/25 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                PDF Tools
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                PDF से जुड़े सभी टूल – Merge, Split, Convert और बहुत कुछ
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('tools')}
            className="px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-red-500 hover:border-red-500 shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>{language === 'hi' ? 'सभी देखें' : 'View All'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 10 Tools Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {[
            { title: 'Image to PDF', id: 'pdf-merge', icon: <FileText className="w-5 h-5 text-rose-600" />, iconBg: 'bg-rose-100 dark:bg-rose-950/60' },
            { title: 'PDF to JPG', id: 'convert-image', icon: <FileText className="w-5 h-5 text-blue-600" />, iconBg: 'bg-blue-100 dark:bg-blue-950/60' },
            { title: 'Merge PDF', id: 'pdf-merge', icon: <Layers className="w-5 h-5 text-purple-600" />, iconBg: 'bg-purple-100 dark:bg-purple-950/60' },
            { title: 'Split PDF', id: 'pdf-split', icon: <Scissors className="w-5 h-5 text-orange-600" />, iconBg: 'bg-orange-100 dark:bg-orange-950/60' },
            { title: 'Compress PDF', id: 'compress-image', icon: <Layers className="w-5 h-5 text-red-600" />, iconBg: 'bg-red-100 dark:bg-red-950/60' },
            { title: 'JPG to PDF', id: 'pdf-merge', icon: <Maximize2 className="w-5 h-5 text-cyan-600" />, iconBg: 'bg-cyan-100 dark:bg-cyan-950/60' },
            { title: 'PDF to Text', id: 'convert-image', icon: <ScanLine className="w-5 h-5 text-teal-600" />, iconBg: 'bg-teal-100 dark:bg-teal-950/60' },
            { title: 'Add Page Number', id: 'pdf-split', icon: <FilePlus className="w-5 h-5 text-violet-600" />, iconBg: 'bg-violet-100 dark:bg-violet-950/60' },
            { title: 'Remove Page', id: 'pdf-split', icon: <FileX className="w-5 h-5 text-red-600" />, iconBg: 'bg-red-100 dark:bg-red-950/60' },
            { title: 'Rotate PDF', id: 'pdf-split', icon: <RotateCw className="w-5 h-5 text-amber-600" />, iconBg: 'bg-amber-100 dark:bg-amber-950/60' },
          ].map((tool) => (
            <button
              key={tool.title}
              type="button"
              onClick={() => handleLaunchTool(tool.id)}
              className="bg-white dark:bg-[#151D2E] rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-red-400 hover:-translate-y-0.5 transition-all flex items-center gap-3 text-left cursor-pointer group"
            >
              <div className={`w-10 h-10 rounded-xl ${tool.iconBg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                {tool.icon}
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-red-500 transition-colors leading-tight">
                {tool.title}
              </span>
            </button>
          ))}
        </div>

      </section>

      {/* =========================================================================
          7. POPULAR TOOLS FOR YOU (Flame icon + 6 Cards)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Header Strip */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/25 shrink-0">
            <Flame className="w-5 h-5 fill-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Popular Tools For You
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              सबसे ज्यादा इस्तेमाल होने वाले टूल
            </p>
          </div>
        </div>

        {/* 6 Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {[
            { title: 'Background Remove', id: 'passport-photo', icon: <Scissors className="w-5 h-5 text-rose-500" />, iconBg: 'bg-rose-100 dark:bg-rose-950/60' },
            { title: 'Resize Image', id: 'resize-image', icon: <Maximize2 className="w-5 h-5 text-sky-500" />, iconBg: 'bg-sky-100 dark:bg-sky-950/60' },
            { title: 'Compress to 50KB', id: 'compress-image', icon: <Layers className="w-5 h-5 text-emerald-500" />, iconBg: 'bg-emerald-100 dark:bg-emerald-950/60' },
            { title: 'Image Converter', id: 'convert-image', icon: <RefreshCw className="w-5 h-5 text-purple-500" />, iconBg: 'bg-purple-100 dark:bg-purple-950/60' },
            { title: 'Instagram Resize', id: 'resize-image', icon: <Instagram className="w-5 h-5 text-orange-500" />, iconBg: 'bg-orange-100 dark:bg-orange-950/60' },
            { title: 'WhatsApp DP Maker', id: 'passport-photo', icon: <MessageCircle className="w-5 h-5 text-emerald-600" />, iconBg: 'bg-emerald-100 dark:bg-emerald-950/60' },
          ].map((tool) => (
            <button
              key={tool.title}
              type="button"
              onClick={() => handleLaunchTool(tool.id)}
              className="bg-white dark:bg-[#151D2E] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-orange-400 hover:-translate-y-0.5 transition-all flex flex-col items-center justify-center text-center gap-2.5 cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-2xl ${tool.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                {tool.icon}
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-orange-500 transition-colors leading-tight">
                {tool.title}
              </span>
            </button>
          ))}
        </div>

      </section>

      {/* =========================================================================
          8. 4 TRUST / VALUE HIGHLIGHT CARDS
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Fast Processing */}
          <div className="bg-white dark:bg-[#151D2E] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">Fast Processing</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">कुछ ही सेकंड में</p>
            </div>
          </div>

          {/* Card 2: 100% Free */}
          <div className="bg-white dark:bg-[#151D2E] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">100% Free</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">बिना किसी शुल्क के</p>
            </div>
          </div>

          {/* Card 3: Your Privacy */}
          <div className="bg-white dark:bg-[#151D2E] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400 flex items-center justify-center shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">Your Privacy</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">फाइल हमारे सर्वर पर सुरक्षित</p>
            </div>
          </div>

          {/* Card 4: No Installation */}
          <div className="bg-white dark:bg-[#151D2E] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400 flex items-center justify-center shrink-0">
              <CloudOff className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">No Installation</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">कोई सॉफ्टवेयर नहीं चाहिए</p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
