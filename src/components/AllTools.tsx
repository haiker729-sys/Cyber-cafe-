import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { TOOL_REGISTRY, CATEGORY_META, RegistryTool } from '../data/toolRegistry.ts';
import { ImageCompressorTool } from './tools/ImageCompressorTool.tsx';
import { PassportPhotoTool } from './tools/PassportPhotoTool.tsx';
import { SignatureTool } from './tools/SignatureTool.tsx';
import { ImageResizeConvertTool } from './tools/ImageResizeConvertTool.tsx';
import { ImageToolsSuite } from './tools/ImageToolsSuite.tsx';
import { PdfMergeTool } from './tools/PdfMergeTool.tsx';
import { PdfSplitterTool } from './tools/PdfSplitterTool.tsx';
import { PdfTools } from './tools/PdfTools.tsx';
import { OcrTool } from './tools/OcrTool.tsx';
import { QrCodeGeneratorTool } from './tools/QrCodeGeneratorTool.tsx';
import { QrBarcodeTool } from './tools/QrBarcodeTool.tsx';
import { CalculatorsTool } from './tools/CalculatorsTool.tsx';
import { WhatsAppPrintTool } from './tools/WhatsAppPrintTool.tsx';
import { 
  Search, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  Layers, 
  FileText, 
  Camera, 
  PenTool, 
  QrCode, 
  Calculator, 
  Printer,
  X,
  Star,
  ChevronRight,
  Maximize2,
  RefreshCw,
  Zap,
  Grid,
  Scissors,
  Check,
  Building2,
  Crown
} from 'lucide-react';

export const AllTools: React.FC = () => {
  const { 
    language, 
    selectedToolId, 
    setSelectedToolId,
    setActiveTab 
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter tools in real-time based on search input and category
  const filteredTools = useMemo(() => {
    return TOOL_REGISTRY.filter((tool) => {
      const matchesCategory = 
        selectedCategory === 'all' || 
        tool.category === selectedCategory;

      const q = search.trim().toLowerCase();
      const matchesSearch = 
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.nameHi.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        (tool.descriptionHi ? tool.descriptionHi.toLowerCase().includes(q) : false) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  // Find active tool from registry or fallback
  const activeTool = useMemo(() => {
    if (!selectedToolId) return null;
    return TOOL_REGISTRY.find((t) => t.id === selectedToolId) || {
      id: selectedToolId,
      name: selectedToolId,
      nameHi: selectedToolId,
      category: 'image',
      description: 'Online tool',
      descriptionHi: 'ऑनलाइन टूल',
      tags: [],
      engine: 'suite',
      status: 'working'
    };
  }, [selectedToolId]);

  // Route tool ID to the active working engine component
  const renderActiveToolComponent = () => {
    if (!selectedToolId) return null;

    // Passport photo & background tools
    if (
      selectedToolId === 'passport-photo-maker' ||
      selectedToolId === 'passport' ||
      selectedToolId === 'background-remove' ||
      selectedToolId === 'ssc-photo-resize' ||
      selectedToolId === 'upsc-photo-resize' ||
      selectedToolId === 'pan-card-photo-signature'
    ) {
      return <PassportPhotoTool />;
    }

    // Compression tools (exact KB limits)
    if (
      selectedToolId === 'compress-to-50kb' ||
      selectedToolId === 'compress-to-20kb' ||
      selectedToolId === 'compress-to-100kb' ||
      selectedToolId === 'compress-to-200kb' ||
      selectedToolId === 'compress-to-custom-kb' ||
      selectedToolId === 'compressor'
    ) {
      return <ImageCompressorTool />;
    }

    // Signature tools
    if (
      selectedToolId === 'resize-signature' ||
      selectedToolId === 'signature-cm-dpi' ||
      selectedToolId === 'signature'
    ) {
      return <SignatureTool />;
    }

    // Resizer tools (pixel / cm / mm / inch / DPI)
    if (
      selectedToolId === 'resize-image' ||
      selectedToolId === 'resizer'
    ) {
      return <ImageResizeConvertTool />;
    }

    // PDF Merge & Split
    if (selectedToolId === 'pdf-merge') {
      return <PdfMergeTool />;
    }
    if (selectedToolId === 'pdf-split') {
      return <PdfSplitterTool />;
    }
    if (selectedToolId === 'image-to-pdf' || selectedToolId === 'img-to-pdf') {
      return <PdfTools />;
    }

    // OCR Tool (Hindi + English)
    if (selectedToolId === 'image-to-text-ocr' || selectedToolId === 'ocr') {
      return <OcrTool />;
    }

    // QR & Barcode
    if (selectedToolId === 'qr-code-generator' || selectedToolId === 'qr-generator') {
      return <QrCodeGeneratorTool />;
    }
    if (selectedToolId === 'barcode-generator') {
      return <QrBarcodeTool />;
    }

    // Calculators
    if (
      selectedToolId === 'age-calculator' ||
      selectedToolId === 'gst-calculator' ||
      selectedToolId === 'emi-calculator' ||
      selectedToolId === 'calculators'
    ) {
      return <CalculatorsTool />;
    }

    // WhatsApp Print
    if (selectedToolId === 'whatsapp-print-order' || selectedToolId === 'whatsapp-print') {
      return <WhatsAppPrintTool />;
    }

    // Default Suite for conversions, filters, watermarks, flip/rotate
    return <ImageToolsSuite />;
  };

  const getToolIcon = (tool: RegistryTool) => {
    switch (tool.category) {
      case 'passport':
        return <Camera className="w-5 h-5 text-blue-500" />;
      case 'compression':
        return <Layers className="w-5 h-5 text-emerald-500" />;
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'resize':
        return <Maximize2 className="w-5 h-5 text-purple-500" />;
      case 'convert':
        return <RefreshCw className="w-5 h-5 text-amber-500" />;
      case 'editing':
        return <Sparkles className="w-5 h-5 text-pink-500" />;
      case 'document':
        return <FileText className="w-5 h-5 text-cyan-500" />;
      case 'qr_barcode':
        return <QrCode className="w-5 h-5 text-orange-500" />;
      case 'calculator':
        return <Calculator className="w-5 h-5 text-blue-500" />;
      case 'printing':
        return <Printer className="w-5 h-5 text-teal-500" />;
      default:
        return <Zap className="w-5 h-5 text-orange-500" />;
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* If a tool is active, render workbench with back navigation */}
      {selectedToolId ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-[#151D2E] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedToolId(null)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all cursor-pointer shadow-sm"
              >
                <ArrowLeft className="w-4 h-4 text-orange-500" />
                <span>{language === 'hi' ? 'सभी टूल्स पर वापस' : 'Back to Tools Directory'}</span>
              </button>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">
                {language === 'hi' ? activeTool?.nameHi : activeTool?.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{language === 'hi' ? '100% एक्टिव व सुरक्षित' : 'Active & In-Browser'}</span>
              </span>
            </div>
          </div>

          {/* Active Tool Workbench */}
          {renderActiveToolComponent()}
        </div>
      ) : (
        /* Real-Time Searchable Tool Registry View */
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Left Category Sidebar (matching reference style) */}
          <aside className="hidden lg:flex flex-col w-64 shrink-0 space-y-6 sticky top-24">
            
            <div className="w-full bg-[#FFFFFF] dark:bg-[#151D2E] rounded-3xl p-3 shadow-md border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 font-semibold text-xs sm:text-sm transition-all text-left cursor-pointer"
              >
                <span className="w-5 h-5 flex items-center justify-center">🏠</span>
                <span>Home</span>
              </button>

              {CATEGORY_META.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/25'
                        : 'text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <span>{cat.labelEn}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}

            </div>

            {/* Premium Tools Widget */}
            <div className="w-full rounded-3xl p-5 bg-gradient-to-b from-[#1E293B] to-[#0F172A] text-white shadow-xl border border-slate-700/60 space-y-3 relative overflow-hidden">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-black tracking-wide text-amber-300">
                  Client-Side Engine
                </h4>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Zero uploads to cloud servers. All image compression, crop, and PDF generation occur safely inside your web browser.
              </p>
            </div>

          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0 space-y-8">
            
            {/* Header with Search and Stats */}
            <div className="bg-[#FFFFFF] dark:bg-[#151D2E] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    {language === 'hi' ? 'सभी ऑनलाइन डिजिटल टूल्स' : 'All Online Digital Tools'}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {language === 'hi'
                      ? 'फोटो, सिग्नेचर, PDF, OCR और कैलकुलेटर के 100% मुफ्त और प्राइवेट टूल्स।'
                      : 'Search, filter, and launch complete client-side image, PDF, and cyber tools.'}
                  </p>
                </div>

                {/* Counter Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-800/80 text-orange-700 dark:text-orange-300 text-xs font-bold self-start md:self-auto">
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {filteredTools.length} {language === 'hi' ? 'टूल्स उपलब्ध' : 'Tools Available'}
                  </span>
                </div>
              </div>

              {/* Real-Time Live Search Input Bar */}
              <div className="relative">
                <div className="flex items-center rounded-2xl bg-slate-100/90 dark:bg-[#101726] border border-slate-300/80 dark:border-slate-700/80 shadow-inner px-4 py-3 focus-within:ring-2 focus-within:ring-orange-500 transition-all">
                  <Search className="w-5 h-5 text-orange-500 shrink-0 mr-3" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={
                      language === 'hi'
                        ? 'टूल्स खोजें (जैसे: 50kb, passport, ssc, pdf, ocr, age, resize)...'
                        : 'Search tools in real-time (e.g. 50kb, passport, ssc, pdf, ocr, age, resize)...'
                    }
                    className="w-full bg-transparent text-sm sm:text-base font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Horizontal Category Pill Tabs (Mobile + Desktop quick filters) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {CATEGORY_META.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {cat.labelEn}
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Filtered Tools Grid */}
            {filteredTools.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTools.map((tool) => (
                  <div
                    key={tool.id}
                    onClick={() => {
                      setSelectedToolId(tool.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-[#FFFFFF] dark:bg-[#151D2E] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Header of Card */}
                      <div className="flex items-center justify-between gap-3 mb-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          {getToolIcon(tool)}
                        </div>
                        <div className="flex items-center gap-1.5">
                          {tool.popular && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400">
                              Popular
                            </span>
                          )}
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                            100% Free
                          </span>
                        </div>
                      </div>

                      {/* Tool Title & Description */}
                      <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors leading-snug">
                        {language === 'hi' ? tool.nameHi : tool.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                        {language === 'hi' ? tool.descriptionHi : tool.description}
                      </p>
                    </div>

                    {/* Bottom CTA Row */}
                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{tool.rating || '4.8'}</span>
                      </div>
                      
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-500 group-hover:translate-x-1 transition-transform">
                        <span>{language === 'hi' ? 'टूल खोलें' : 'Open Tool'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              /* Empty Search State */
              <div className="bg-[#FFFFFF] dark:bg-[#151D2E] rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center mx-auto text-2xl">
                  🔍
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {language === 'hi' ? 'कोई टूल नहीं मिला' : 'No tools found matching your search'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  {language === 'hi'
                    ? `"${search}" के लिए कोई टूल नहीं मिला। कृपया दूसरा शब्द खोजें या सभी टूल्स देखें।`
                    : `We couldn't find any tool matching "${search}". Try searching for photo, pdf, or compress.`}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setSelectedCategory('all');
                  }}
                  className="px-5 py-2.5 rounded-full bg-orange-500 text-white text-xs font-bold shadow-md cursor-pointer hover:bg-orange-600 transition-colors"
                >
                  {language === 'hi' ? 'सभी टूल्स देखें' : 'Reset Filters'}
                </button>
              </div>
            )}

          </main>

        </div>
      )}

    </div>
  );
};
