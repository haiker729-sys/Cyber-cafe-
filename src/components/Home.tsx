import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { TOOL_REGISTRY, RegistryTool } from '../data/toolRegistry.ts';
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
  Zap, 
  ShieldCheck, 
  Instagram, 
  MessageCircle, 
  ChevronRight, 
  Printer, 
  Star, 
  QrCode, 
  Calculator, 
  PhoneCall, 
  MapPin, 
  Laptop, 
  Check, 
  Building2, 
  Grid, 
  Crown,
  FileCheck,
  ChevronDown
} from 'lucide-react';

export const Home: React.FC = () => {
  const { 
    language, 
    setActiveTab, 
    setSelectedToolId,
    shopSettings 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Filter tools for live search dropdown
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return TOOL_REGISTRY.filter(t => 
      t.name.toLowerCase().includes(q) ||
      t.nameHi.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [searchQuery]);

  const handleLaunchTool = (toolId: string) => {
    setSelectedToolId(toolId);
    setActiveTab('tools');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (catId: string) => {
    if (catId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (catId === 'services') {
      setActiveTab('services');
      return;
    }
    if (catId === 'govt') {
      setActiveTab('govt');
      return;
    }
    setActiveTab('tools');
    setSelectedToolId(null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (searchResults.length > 0) {
        handleLaunchTool(searchResults[0].id);
      } else {
        setActiveTab('tools');
      }
    }
  };

  const handleWhatsAppContact = () => {
    const text = encodeURIComponent(
      language === 'hi' 
        ? 'नमस्ते मेराज कैफे पॉइंट! मुझे प्रिंटिंग और ऑनलाइन सेवाओं के बारे में जानकारी चाहिए।'
        : 'Hello Meraj Cafe Point! I need assistance with printing or online application.'
    );
    window.open(`https://wa.me/91${shopSettings.whatsapp}?text=${text}`, '_blank');
  };

  const sidebarItems = [
    { id: 'image', label: 'Image Tools', icon: <ImageIcon className="w-4 h-4 text-orange-500" /> },
    { id: 'pdf', label: 'PDF Tools', icon: <FileText className="w-4 h-4 text-red-500" /> },
    { id: 'passport', label: 'Passport & ID', icon: <UserCheck className="w-4 h-4 text-blue-500" /> },
    { id: 'resize', label: 'Resize Tools', icon: <Maximize2 className="w-4 h-4 text-purple-500" /> },
    { id: 'compression', label: 'Compression', icon: <Layers className="w-4 h-4 text-emerald-500" /> },
    { id: 'convert', label: 'Format Convert', icon: <RefreshCw className="w-4 h-4 text-amber-500" /> },
    { id: 'editing', label: 'Editing & Effects', icon: <Sparkles className="w-4 h-4 text-pink-500" /> },
    { id: 'ai', label: 'AI Tools', icon: <Zap className="w-4 h-4 text-violet-500" />, isNew: true },
    { id: 'social', label: 'Social Media', icon: <Instagram className="w-4 h-4 text-rose-500" /> },
    { id: 'services', label: 'Cyber Cafe Services', icon: <Printer className="w-4 h-4 text-teal-500" /> },
    { id: 'govt', label: 'Govt & Jobs', icon: <Building2 className="w-4 h-4 text-emerald-600" /> },
    { id: 'all', label: 'All Tools', icon: <Grid className="w-4 h-4 text-slate-500" /> },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6">
      
      {/* 2-COLUMN STRUCTURE MATCHING SCREENSHOT EXACTLY */}
      <div className="flex flex-col md:flex-row gap-5 lg:gap-6 items-start">
        
        {/* =========================================================================
            LEFT SIDEBAR (Visible on Tablet & Desktop, Exactly matching screenshot)
            ========================================================================= */}
        <aside className="hidden md:flex flex-col w-56 lg:w-64 shrink-0 space-y-5 sticky top-24">
          
          {/* Main Navigation Sidebar Links */}
          <div className="w-full bg-[#FFFFFF] dark:bg-[#151D2E] rounded-3xl p-3 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-200/80 dark:border-slate-800 space-y-1">
            
            {/* Active Home Button (Solid Vibrant Orange Pill) */}
            <button
              type="button"
              onClick={() => handleCategoryClick('home')}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/30 transition-all text-left cursor-pointer"
            >
              <span className="w-5 h-5 flex items-center justify-center text-sm">🏠</span>
              <span>Home</span>
            </button>

            {/* Category Navigation Items */}
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleCategoryClick(item.id)}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 font-semibold text-xs sm:text-sm transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <span>{item.label}</span>
                </div>
                {item.isNew && (
                  <span className="px-1.5 py-0.2 rounded-full bg-orange-500 text-white font-black text-[9px] uppercase tracking-wider">
                    NEW
                  </span>
                )}
              </button>
            ))}

          </div>

          {/* Premium Tools Shiny Card (Exact from screenshot) */}
          <div className="w-full rounded-3xl p-4 sm:p-5 bg-gradient-to-b from-[#182338] to-[#0A101D] text-white shadow-xl border border-slate-700/60 space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-orange-500/15 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center">
                <Crown className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-sm font-black tracking-wide text-amber-300">
                Premium Tools
              </h4>
            </div>
            
            <div className="space-y-1.5 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Fast Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>No Signup Needed</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>100% Free</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Safe & Secure</span>
              </div>
            </div>
          </div>

        </aside>

        {/* =========================================================================
            MAIN COLUMN: HERO, FEATURED, CATEGORIES, TRENDING, SERVICES, QUICK ACCESS
            ========================================================================= */}
        <main className="flex-1 min-w-0 space-y-8 sm:space-y-10">
          
          {/* =========================================================================
              1. HERO BANNER CARD (Soft Neumorphic Card with 3D Illustration)
              ========================================================================= */}
          <section className="relative rounded-3xl bg-gradient-to-br from-white via-[#F7FAFF] to-[#EFF5FC] dark:from-[#151D2E] dark:via-[#131A29] dark:to-[#0F1624] p-5 sm:p-7 lg:p-9 border border-slate-200/90 dark:border-slate-800 shadow-[0_6px_25px_rgba(0,0,0,0.03)] overflow-hidden">
            
            {/* Subtle light background radial gradient */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-200/20 dark:bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              {/* Left Column: Heading, Subtitle, Search, Popular Tags */}
              <div className="lg:col-span-7 space-y-4 text-left">
                
                {/* 100% Free Online Tools Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <span>100% Free Online Tools</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-2xl sm:text-4xl lg:text-[44px] font-black tracking-tight text-[#101C2D] dark:text-white leading-[1.18]">
                  फोटो, इमेज और PDF के सभी टूल{' '}
                  <span className="text-[#F97316]">एक जगह</span>
                </h1>

                {/* Subtitle */}
                <p className="text-xs sm:text-base font-semibold text-slate-600 dark:text-slate-300">
                  Fast • Easy • Secure • Mobile Friendly
                </p>

                {/* Big Search Input Bar with Inset Style & Live Filter Dropdown */}
                <div className="relative pt-1">
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <div className="flex items-center rounded-full bg-white dark:bg-[#0E1522] border border-slate-200 dark:border-slate-700/90 shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-1.5 pl-4 sm:pl-5 transition-all focus-within:ring-2 focus-within:ring-orange-500">
                      <Search className="w-5 h-5 text-slate-400 shrink-0 mr-2.5" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="आपको कौन-सा टूल चाहिए? जैसे: passport photo, compress, image to pdf..."
                        className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="ml-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-xs sm:text-sm shadow-md shadow-orange-500/30 flex items-center gap-2 transition-all shrink-0 cursor-pointer"
                      >
                        <span>खोजें</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>

                  {/* Real-Time Live Search Suggestions Dropdown */}
                  {searchQuery.trim().length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#1E2738] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 z-30 space-y-1">
                      <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {searchResults.length > 0 ? `Matching Tools (${searchResults.length})` : 'कोई टूल नहीं मिला'}
                      </div>
                      {searchResults.map((tool) => (
                        <button
                          key={tool.id}
                          type="button"
                          onClick={() => {
                            setSearchQuery('');
                            handleLaunchTool(tool.id);
                          }}
                          className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-orange-50 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400 flex items-center justify-center font-bold text-xs shrink-0">
                              ⚡
                            </div>
                            <div>
                              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors">
                                {language === 'hi' ? tool.nameHi : tool.name}
                              </div>
                              <div className="text-[11px] text-slate-500 line-clamp-1">
                                {tool.description}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-orange-500 shrink-0 ml-2">
                            खोलें →
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Popular Tool Shortcuts */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-medium">
                  <div className="flex items-center gap-1 text-orange-500 font-bold mr-1">
                    <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                    <span>Popular:</span>
                  </div>
                  {[
                    { label: 'Passport Photo', id: 'passport-photo-maker' },
                    { label: 'Compress to 50KB', id: 'compress-to-50kb' },
                    { label: 'Image to PDF', id: 'image-to-pdf' },
                    { label: 'Background Remove', id: 'background-remove' },
                    { label: 'Resize Image', id: 'resize-image' },
                    { label: 'JPG to PDF', id: 'image-to-pdf' },
                  ].map((tag) => (
                    <button
                      key={tag.label}
                      type="button"
                      onClick={() => handleLaunchTool(tag.id)}
                      className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-400 border border-slate-200 dark:border-slate-700 shadow-sm transition-all cursor-pointer"
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>

              </div>

              {/* Right Column: 3D Illustration Graphic Matching Screenshot Exactly */}
              <div className="lg:col-span-5 relative flex flex-col items-center justify-center py-2">
                
                <div className="relative w-full max-w-[320px] aspect-[4/3] flex items-center justify-center">
                  
                  {/* Circular Rotating Swoosh Arrow Graphic */}
                  <svg className="absolute inset-0 w-full h-full text-orange-400/50 pointer-events-none" viewBox="0 0 200 160" fill="none">
                    <path d="M 40 40 C 90 5, 160 20, 170 80 C 180 130, 120 150, 60 140" stroke="currentColor" strokeWidth="2.5" strokeDasharray="5 5" />
                    <polygon points="55,143 65,135 63,148" fill="currentColor" />
                  </svg>

                  {/* Central Photo Frame Card with Sky and Mountain */}
                  <div className="relative w-40 h-32 rounded-2xl bg-white dark:bg-slate-800 p-1.5 shadow-2xl border-2 border-white dark:border-slate-700 transform -rotate-3 hover:rotate-0 transition-transform overflow-hidden">
                    <div className="w-full h-full rounded-xl bg-gradient-to-b from-sky-400 via-sky-300 to-amber-100 flex flex-col justify-between p-2 relative overflow-hidden">
                      {/* Sun */}
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-300 to-orange-400 shadow-md ml-auto" />
                      {/* Stylized Mountains */}
                      <div className="flex items-end justify-between -mb-2 -mx-2">
                        <div className="w-20 h-14 bg-blue-600/50 rounded-t-full transform translate-x-3" />
                        <div className="w-24 h-16 bg-blue-700/60 rounded-t-full" />
                      </div>
                    </div>
                  </div>

                  {/* Floating Badge 1: JPG (Orange, Left) */}
                  <div className="absolute top-14 left-0 px-3 py-1 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs shadow-lg shadow-orange-500/30 flex items-center gap-1">
                    <span>JPG</span>
                  </div>

                  {/* Floating Badge 2: PNG (Cyan, Top Right) */}
                  <div className="absolute top-2 right-6 px-3 py-1 rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 text-white font-black text-xs shadow-lg shadow-sky-500/30 flex items-center gap-1">
                    <span>PNG</span>
                  </div>

                  {/* Floating Badge 3: PDF (Red, Bottom Right) */}
                  <div className="absolute bottom-2 right-4 px-3 py-1 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-black text-xs shadow-lg shadow-red-500/30 flex items-center gap-1">
                    <span>PDF</span>
                  </div>

                </div>

                {/* Floating Right Checklist Box (Exact from Screenshot) */}
                <div className="absolute top-2 right-0 sm:right-2 bg-white/95 dark:bg-[#1A2333]/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-slate-100 dark:border-slate-700 space-y-1.5 text-left min-w-[125px]">
                  {[
                    'तेज प्रोसेसिंग',
                    '100% फ्री',
                    'कोई सॉफ्टवेयर नहीं',
                    'मोबाइल फ्रेंडली'
                  ].map((text, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] font-bold text-slate-800 dark:text-slate-200">
                      <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>

                {/* Social Proof: Overlapping Avatars + 5 Stars */}
                <div className="mt-3 flex items-center gap-2.5 bg-white/90 dark:bg-slate-800/90 px-3.5 py-1.5 rounded-full border border-slate-200/60 dark:border-slate-700 shadow-sm">
                  <div className="flex -space-x-2">
                    <img className="w-6 h-6 rounded-full border border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop" alt="User" />
                    <img className="w-6 h-6 rounded-full border border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop" alt="User" />
                    <img className="w-6 h-6 rounded-full border border-white object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop" alt="User" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-bold text-slate-800 dark:text-slate-200 leading-none">
                      Trusted by Thousands
                    </div>
                    <div className="flex items-center text-amber-400 text-[10px] mt-0.5">
                      {'★'.repeat(5)}
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </section>

          {/* =========================================================================
              2. TOP 4 FEATURED TOOL CARDS (Large Soft Cards matching screenshot)
              ========================================================================= */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Passport Photo Maker */}
            <div
              onClick={() => handleLaunchTool('passport-photo-maker')}
              className="bg-[#FFFFFF] dark:bg-[#151D2E] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400 flex items-center justify-center shrink-0">
                  <Camera className="w-6 h-6" />
                </div>
                {/* 3 mini passport avatars in a row matching screenshot */}
                <div className="flex -space-x-1">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=100&fit=crop" alt="Passport 1" className="w-6 h-8 rounded object-cover border-2 border-white shadow-sm" />
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=100&fit=crop" alt="Passport 2" className="w-6 h-8 rounded object-cover border-2 border-white shadow-sm" />
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=100&fit=crop" alt="Passport 3" className="w-6 h-8 rounded object-cover border-2 border-white shadow-sm" />
                </div>
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">
                  Passport Photo Maker
                </h3>
                <div className="flex items-center justify-between mt-1 text-xs text-slate-500 dark:text-slate-400">
                  <span>सभी साइज में बनाएं</span>
                  <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Compress to 50KB */}
            <div
              onClick={() => handleLaunchTool('compress-to-50kb')}
              className="bg-[#FFFFFF] dark:bg-[#151D2E] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                {/* File size compression document icon with arrow */}
                <div className="flex items-center gap-1.5 text-blue-500 font-bold text-xs bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-xl">
                  <span>📄</span>
                  <span className="text-slate-400">→</span>
                  <span className="text-blue-600 dark:text-blue-400 font-black">50KB</span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">
                  Compress to 50KB
                </h3>
                <div className="flex items-center justify-between mt-1 text-xs text-slate-500 dark:text-slate-400">
                  <span>फोटो का साइज कम करें</span>
                  <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Image to PDF */}
            <div
              onClick={() => handleLaunchTool('image-to-pdf')}
              className="bg-[#FFFFFF] dark:bg-[#151D2E] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400 flex items-center justify-center shrink-0">
                  <span className="font-black text-sm">JPG</span>
                </div>
                {/* JPG to PDF graphic */}
                <div className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/40 px-2.5 py-1 rounded-xl">
                  <span>JPG</span>
                  <span className="text-slate-400">→</span>
                  <span className="text-red-600 dark:text-red-400 font-black">PDF</span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">
                  Image to PDF
                </h3>
                <div className="flex items-center justify-between mt-1 text-xs text-slate-500 dark:text-slate-400">
                  <span>इमेज को PDF में बदलें</span>
                  <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Background Remove */}
            <div
              onClick={() => handleLaunchTool('background-remove')}
              className="bg-[#FFFFFF] dark:bg-[#151D2E] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Scissors className="w-6 h-6" />
                </div>
                {/* Cutout woman avatar matching screenshot */}
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop" 
                  alt="Avatar" 
                  className="w-9 h-9 rounded-full border-2 border-emerald-400 object-cover shadow-sm" 
                />
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">
                  Background Remove
                </h3>
                <div className="flex items-center justify-between mt-1 text-xs text-slate-500 dark:text-slate-400">
                  <span>फोटो का बैकग्राउंड हटाएं</span>
                  <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>

          </section>

          {/* =========================================================================
              3. TOOL CATEGORIES SECTION (Exact 15 Neumorphic Cards Grid)
              ========================================================================= */}
          <section className="space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400 flex items-center justify-center">
                  <Grid className="w-4 h-4" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Tool Categories
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedToolId(null);
                  setActiveTab('tools');
                }}
                className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-orange-500 flex items-center gap-1 cursor-pointer"
              >
                <span>View All Tools</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* 15 Category Cards Grid matching screenshot */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {[
                { id: 'image', label: 'Image Tools', count: '25+ Tools', icon: <ImageIcon className="w-5 h-5 text-orange-500" />, iconBg: 'bg-orange-100 dark:bg-orange-950/60' },
                { id: 'pdf', label: 'PDF Tools', count: '20+ Tools', icon: <FileText className="w-5 h-5 text-red-500" />, iconBg: 'bg-red-100 dark:bg-red-950/60' },
                { id: 'passport', label: 'Passport & ID', count: '15+ Tools', icon: <UserCheck className="w-5 h-5 text-blue-500" />, iconBg: 'bg-blue-100 dark:bg-blue-950/60' },
                { id: 'resize', label: 'Resize Tools', count: '20+ Tools', icon: <Maximize2 className="w-5 h-5 text-purple-500" />, iconBg: 'bg-purple-100 dark:bg-purple-950/60' },
                { id: 'compression', label: 'Compression', count: '15+ Tools', icon: <Layers className="w-5 h-5 text-emerald-500" />, iconBg: 'bg-emerald-100 dark:bg-emerald-950/60' },
                { id: 'convert', label: 'Format Convert', count: '12+ Tools', icon: <RefreshCw className="w-5 h-5 text-amber-500" />, iconBg: 'bg-amber-100 dark:bg-amber-950/60' },
                { id: 'editing', label: 'Editing & Effects', count: '12+ Tools', icon: <Sparkles className="w-5 h-5 text-pink-500" />, iconBg: 'bg-pink-100 dark:bg-pink-950/60' },
                { id: 'ai', label: 'AI Tools', count: '10+ Tools', icon: <Zap className="w-5 h-5 text-violet-500" />, iconBg: 'bg-violet-100 dark:bg-violet-950/60', isNew: true },
                { id: 'social', label: 'Social Media', count: '8+ Tools', icon: <Instagram className="w-5 h-5 text-rose-500" />, iconBg: 'bg-rose-100 dark:bg-rose-950/60' },
                { id: 'services', label: 'Cyber Cafe Services', count: '15+ Services', icon: <Printer className="w-5 h-5 text-teal-500" />, iconBg: 'bg-teal-100 dark:bg-teal-950/60' },
                { id: 'govt', label: 'Govt & Jobs', count: '20+ Links', icon: <Building2 className="w-5 h-5 text-emerald-600" />, iconBg: 'bg-emerald-100 dark:bg-emerald-950/60' },
                { id: 'document', label: 'Document & OCR', count: '10+ Tools', icon: <FileText className="w-5 h-5 text-cyan-500" />, iconBg: 'bg-cyan-100 dark:bg-cyan-950/60' },
                { id: 'qr_barcode', label: 'QR & Barcode', count: '8+ Tools', icon: <QrCode className="w-5 h-5 text-orange-500" />, iconBg: 'bg-orange-100 dark:bg-orange-950/60' },
                { id: 'calculator', label: 'Calculators', count: '10+ Tools', icon: <Calculator className="w-5 h-5 text-blue-500" />, iconBg: 'bg-blue-100 dark:bg-blue-950/60' },
                { id: 'all', label: 'All Tools', count: '100+ Tools', icon: <Grid className="w-5 h-5 text-slate-500" />, iconBg: 'bg-slate-100 dark:bg-slate-800' },
              ].map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="bg-[#FFFFFF] dark:bg-[#151D2E] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-3 relative group"
                >
                  <div className={`w-11 h-11 rounded-xl ${cat.iconBg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    {cat.icon}
                  </div>
                  <div className="min-w-0 text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                        {cat.label}
                      </span>
                      {cat.isNew && (
                        <span className="px-1 py-0.2 rounded-full bg-orange-500 text-white font-black text-[8px] uppercase">
                          NEW
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-semibold text-orange-600 dark:text-orange-400">
                      {cat.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </section>

          {/* =========================================================================
              4. TRENDING TOOLS SECTION (6 Cards in a Row with Ratings & Free Badge)
              ========================================================================= */}
          <section className="space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Trending Tools
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedToolId(null);
                  setActiveTab('tools');
                }}
                className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-orange-500 flex items-center gap-1 cursor-pointer"
              >
                <span>See All</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* 6 Trending Cards in Row matching screenshot */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              {[
                { 
                  id: 'passport-photo-maker', 
                  title: 'Passport Photo Maker', 
                  rating: 4.9, 
                  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop' 
                },
                { 
                  id: 'compress-to-50kb', 
                  title: 'Compress to 50KB', 
                  rating: 4.8, 
                  icon: <ImageIcon className="w-5 h-5 text-blue-500" />, 
                  iconBg: 'bg-blue-100 dark:bg-blue-950/60' 
                },
                { 
                  id: 'image-to-pdf', 
                  title: 'Image to PDF', 
                  rating: 4.8, 
                  icon: <FileText className="w-5 h-5 text-red-500" />, 
                  iconBg: 'bg-red-100 dark:bg-red-950/60' 
                },
                { 
                  id: 'background-remove', 
                  title: 'Background Remove', 
                  rating: 4.7, 
                  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop' 
                },
                { 
                  id: 'resize-image', 
                  title: 'Resize Image', 
                  rating: 4.7, 
                  icon: <Maximize2 className="w-5 h-5 text-orange-500" />, 
                  iconBg: 'bg-orange-100 dark:bg-orange-950/60' 
                },
                { 
                  id: 'image-to-text-ocr', 
                  title: 'Image to Text (OCR)', 
                  rating: 4.6, 
                  icon: <FileText className="w-5 h-5 text-blue-500" />, 
                  iconBg: 'bg-blue-100 dark:bg-blue-950/60' 
                },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleLaunchTool(item.id)}
                  className="bg-[#FFFFFF] dark:bg-[#151D2E] rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between mb-3">
                    {item.avatarUrl ? (
                      <img src={item.avatarUrl} alt={item.title} className="w-9 h-9 rounded-xl object-cover shadow-sm" />
                    ) : (
                      <div className={`w-9 h-9 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0`}>
                        {item.icon}
                      </div>
                    )}
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                      Free
                    </span>
                  </div>

                  <div className="text-left">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-orange-500 transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1 mt-1 text-xs text-slate-500 dark:text-slate-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-slate-700 dark:text-slate-300">{item.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </section>

          {/* =========================================================================
              5. CYBER CAFE SERVICES + QUICK ACCESS ROW (Matching screenshot)
              ========================================================================= */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
            
            {/* Left 8/12: Cyber Cafe Services Cards */}
            <div className="lg:col-span-8 space-y-4">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-teal-100 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Cyber Cafe Services
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('services')}
                  className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-orange-500 flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Services</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* 4 Cyber Cafe Services Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {[
                  {
                    title: 'Online Form Apply',
                    subtitle: '(JOB, School, Scholarship)',
                    icon: <FileText className="w-5 h-5 text-pink-500" />,
                    iconBg: 'bg-pink-100 dark:bg-pink-950/60',
                    action: () => setActiveTab('services')
                  },
                  {
                    title: 'Print, Scan & Xerox',
                    subtitle: 'Colour / B&W',
                    icon: <Printer className="w-5 h-5 text-blue-500" />,
                    iconBg: 'bg-blue-100 dark:bg-blue-950/60',
                    action: () => handleLaunchTool('whatsapp-print-order')
                  },
                  {
                    title: 'Lamination',
                    subtitle: 'Document Protection',
                    icon: <ShieldCheck className="w-5 h-5 text-amber-500" />,
                    iconBg: 'bg-amber-100 dark:bg-amber-950/60',
                    action: () => setActiveTab('pricing')
                  },
                  {
                    title: 'Photo Print',
                    subtitle: 'Passport, ID, 4x6, A4',
                    icon: <Camera className="w-5 h-5 text-orange-500" />,
                    iconBg: 'bg-orange-100 dark:bg-orange-950/60',
                    action: () => handleLaunchTool('passport-photo-maker')
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={item.action}
                    className="bg-[#FFFFFF] dark:bg-[#151D2E] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between text-left group"
                  >
                    <div className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Right 4/12: Quick Access Panel (WhatsApp, Call, Location) */}
            <div className="lg:col-span-4 bg-[#FFFFFF] dark:bg-[#151D2E] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3.5">
              
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" />
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Quick Access
                </h3>
              </div>

              <div className="space-y-2.5">
                
                {/* 1. WhatsApp Button (Green) */}
                <button
                  type="button"
                  onClick={handleWhatsAppContact}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        WhatsApp
                      </div>
                      <div className="text-sm font-black text-emerald-900 dark:text-emerald-100">
                        9060776981
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* 2. Call Now Button (Orange) */}
                <a
                  href={`tel:91${shopSettings.phone}`}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/40 text-orange-800 dark:text-orange-200 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F97316] text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        Call Now
                      </div>
                      <div className="text-sm font-black text-orange-900 dark:text-orange-100">
                        9060776981
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-orange-500 group-hover:translate-x-1 transition-transform" />
                </a>

                {/* 3. Location Button (Blue) */}
                <a
                  href={shopSettings.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-800 dark:text-blue-200 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        Location
                      </div>
                      <div className="text-sm font-black text-blue-900 dark:text-blue-100">
                        Madhubani, Bihar
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
                </a>

              </div>

            </div>

          </section>

          {/* =========================================================================
              6. FEATURE BADGES BAR (5 Horizontal Soft Pills matching screenshot)
              ========================================================================= */}
          <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
            {[
              {
                icon: <Laptop className="w-5 h-5 text-blue-500" />,
                title: 'No Software Needed',
                desc: 'सीधे ब्राउज़र में काम करें',
              },
              {
                icon: <Zap className="w-5 h-5 text-orange-500" />,
                title: 'Fast Processing',
                desc: 'कुछ ही सेकंड में',
              },
              {
                icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
                title: '100% Free',
                desc: 'बिना किसी शुल्क के',
              },
              {
                icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
                title: 'Safe & Secure',
                desc: 'आपकी फाइल सुरक्षित है',
              },
              {
                icon: <Share2 className="w-5 h-5 text-blue-600" />,
                title: 'Mobile Friendly',
                desc: 'सभी डिवाइस पर काम करता है',
              },
            ].map((badge, idx) => (
              <div
                key={idx}
                className="p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-[#FFFFFF] dark:bg-[#151D2E] shadow-sm flex items-center gap-3 text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  {badge.icon}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    {badge.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {badge.desc}
                  </p>
                </div>
              </div>
            ))}
          </section>

        </main>

      </div>

    </div>
  );
};
