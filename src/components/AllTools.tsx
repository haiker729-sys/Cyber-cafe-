import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { TOOLS_LIST } from '../data/mockData.ts';
import { ToolItem } from '../types.ts';
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
  Clock, 
  Layers, 
  FileText, 
  Camera, 
  PenTool, 
  QrCode, 
  Calculator, 
  Printer,
  HelpCircle,
  BookOpen,
  X,
  ArrowRight
} from 'lucide-react';

interface ToolGuideInfo {
  stepsEn: Array<{ step: number; title: string; desc: string }>;
  stepsHi: Array<{ step: number; title: string; desc: string }>;
}

const TOOL_GUIDES_DATA: Record<string, ToolGuideInfo> = {
  compressor: {
    stepsEn: [
      { step: 1, title: 'Select Image', desc: 'Upload your photo (JPG, PNG, WebP) from phone or PC.' },
      { step: 2, title: 'Set Target KB', desc: 'Choose 20KB, 50KB (SSC/BPSC standard), or type custom size.' },
      { step: 3, title: 'Download Instantly', desc: 'Binary search optimizes file size without loss of readability.' }
    ],
    stepsHi: [
      { step: 1, title: 'फोटो अपलोड करें', desc: 'फोन या कंप्यूटर से अपनी फोटो (JPG, PNG, WebP) चुनें।' },
      { step: 2, title: 'टारगेट KB चुनें', desc: '20KB, 50KB (SSC/BPSC मानक) या अपनी पसंद का साइज लिखें।' },
      { step: 3, title: 'तुरंत डाउनलोड करें', desc: 'बिना धुंधला किए फाइल कम्प्रेस हो जाएगी; तुरंत डाउनलोड करें।' }
    ]
  },
  passport: {
    stepsEn: [
      { step: 1, title: 'Upload Portrait', desc: 'Choose a clear front-facing portrait or selfie.' },
      { step: 2, title: 'Crop 35x45mm', desc: 'Align within frame; select 300 DPI and optional white/blue background.' },
      { step: 3, title: 'Save Single or Sheet', desc: 'Download single photo or ready-to-print 4x6 / A4 cut-mark sheet.' }
    ],
    stepsHi: [
      { step: 1, title: 'फोटो चुनें', desc: 'अपनी साफ चेहरे वाली पासपोर्ट साइज या सेल्फी फोटो चुनें।' },
      { step: 2, title: '35×45mm क्रॉप करें', desc: 'फ्रेम में सेट करें, 300 DPI और सफेद/हल्का नीला बैकग्राउंड चुनें।' },
      { step: 3, title: 'शीट डाउनलोड करें', desc: 'सिंगल फोटो या कट-मार्क वाली 4×6 / A4 प्रिंटेबल शीट प्राप्त करें।' }
    ]
  },
  signature: {
    stepsEn: [
      { step: 1, title: 'Upload Signature', desc: 'Photo of your signature written on plain white paper.' },
      { step: 2, title: 'Clean & Frame', desc: 'Select 140x60px; filter whitens paper background and darkens ink.' },
      { step: 3, title: 'Export Compliant File', desc: 'Compressed automatically under 10-20KB ready for portals.' }
    ],
    stepsHi: [
      { step: 1, title: 'हस्ताक्षर अपलोड करें', desc: 'सफेद सादे कागज पर किए गए सिग्नेचर की फोटो चुनें।' },
      { step: 2, title: 'साइज व बैकग्राउंड साफ करें', desc: '140×60px प्रीसेट चुनें; बैकग्राउंड शुद्ध सफेद और स्याही गहरी होगी।' },
      { step: 3, title: '10-20KB में डाउनलोड करें', desc: 'सरकारी परीक्षा पोर्टल में अपलोड करने के लिए तुरंत डाउनलोड करें।' }
    ]
  },
  resizer: {
    stepsEn: [
      { step: 1, title: 'Upload Image', desc: 'Select the image file to resize or convert.' },
      { step: 2, title: 'Set Width/Height & Format', desc: 'Type custom pixel dimensions and choose JPG, PNG, or WebP.' },
      { step: 3, title: 'Inject DPI & Download', desc: 'Embed 300 DPI metadata and save with exact dimensions.' }
    ],
    stepsHi: [
      { step: 1, title: 'इमेज अपलोड करें', desc: 'रीसाइज करने या फॉर्मेट बदलने के लिए फोटो चुनें।' },
      { step: 2, title: 'चौड़ाई, ऊंचाई व फॉर्मेट तय करें', desc: 'पिक्सल में साइज लिखें और JPG, PNG या WebP चुनें।' },
      { step: 3, title: 'DPI सेट व डाउनलोड', desc: '300 DPI जोड़कर सटीक साइज में फाइल डाउनलोड करें।' }
    ]
  },
  'pdf-merge': {
    stepsEn: [
      { step: 1, title: 'Add PDF Files', desc: 'Upload 2 or more PDF certificates, marksheets, or cards.' },
      { step: 2, title: 'Order Documents', desc: 'Use ↑ / ↓ arrow buttons to set the desired sequence of files.' },
      { step: 3, title: 'Merge & Download', desc: 'Combine all pages into one single PDF in your browser securely.' }
    ],
    stepsHi: [
      { step: 1, title: 'PDF फाइलें जोड़ें', desc: 'मर्ज करने के लिए 2 या अधिक PDF दस्तावेज चुनें।' },
      { step: 2, title: 'क्रम व्यवस्थित करें', desc: 'ऊपर/नीचे तीरों (↑ / ↓) से जिस पेज को आगे रखना है सेट करें।' },
      { step: 3, title: 'मर्ज व डाउनलोड', desc: 'ब्राउज़र में 100% सुरक्षित रूप से एक PDF फाइल डाउनलोड करें।' }
    ]
  },
  'pdf-split': {
    stepsEn: [
      { step: 1, title: 'Upload PDF', desc: 'Select any multi-page PDF document you want to extract from.' },
      { step: 2, title: 'Select Pages', desc: 'Click page thumbnails or type a range like 1-2, 4 in the box.' },
      { step: 3, title: 'Download Pages', desc: 'Save selected pages as a combined PDF or separate ZIP archive.' }
    ],
    stepsHi: [
      { step: 1, title: 'PDF अपलोड करें', desc: 'जिस PDF से पेज अलग निकालने हैं उसे चुनें।' },
      { step: 2, title: 'पेज चुनें या रेंज लिखें', desc: 'पेज पर क्लिक करें या 1-2, 4 जैसी रेंज दर्ज करें।' },
      { step: 3, title: 'अलग PDF डाउनलोड करें', desc: 'चुने गए पेजों की सिंगल PDF या अलग-अलग ZIP फाइल प्राप्त करें।' }
    ]
  },
  'img-to-pdf': {
    stepsEn: [
      { step: 1, title: 'Upload Photos', desc: 'Select document photos or certificate scans.' },
      { step: 2, title: 'Arrange Order', desc: 'Sort page order and orientation.' },
      { step: 3, title: 'Export PDF', desc: 'Download as single clean multi-page document PDF.' }
    ],
    stepsHi: [
      { step: 1, title: 'फोटो अपलोड करें', desc: 'दस्तावेजों या प्रमाण पत्रों की फोटो चुनें।' },
      { step: 2, title: 'क्रम तय करें', desc: 'पेज का सही क्रम और ओरिएंटेशन व्यवस्थित करें।' },
      { step: 3, title: 'PDF डाउनलोड करें', desc: 'तैयार A4 मल्टी-पेज PDF तुरंत डाउनलोड करें।' }
    ]
  },
  ocr: {
    stepsEn: [
      { step: 1, title: 'Upload Document Scan', desc: 'Select a scanned photo or printed document.' },
      { step: 2, title: 'Select Language', desc: 'Choose Hindi, English, or Hindi + English combined.' },
      { step: 3, title: 'Copy Text', desc: 'Extract editable text; copy to clipboard or save as TXT.' }
    ],
    stepsHi: [
      { step: 1, title: 'दस्तावेज़ फोटो चुनें', desc: 'किसी भी छपे हुए कागज या सर्टिफिकेट की फोटो अपलोड करें।' },
      { step: 2, title: 'भाषा चुनें', desc: 'हिंदी, अंग्रेजी या दोनों भाषाएं सेलेक्ट करें।' },
      { step: 3, title: 'टेक्स्ट कॉपी करें', desc: 'निकाले गए टेक्स्ट को सीधे कॉपी करें या TXT में सेव करें।' }
    ]
  },
  'qr-generator': {
    stepsEn: [
      { step: 1, title: 'Choose QR Type', desc: 'Select WhatsApp link, UPI payment, URL, or Text.' },
      { step: 2, title: 'Enter Info', desc: 'Type phone number (auto +91 prefix) or UPI VPA.' },
      { step: 3, title: 'Download QR', desc: 'Save high-resolution PNG or SVG code instantly.' }
    ],
    stepsHi: [
      { step: 1, title: 'QR प्रकार चुनें', desc: 'व्हाट्सएप चैट लिंक, UPI पेमेंट या यूआरएल चुनें।' },
      { step: 2, title: 'जानकारी दर्ज करें', desc: 'मोबाइल नंबर (+91 ऑटो) या UPI ID दर्ज करें।' },
      { step: 3, title: 'QR कोड डाउनलोड', desc: 'HD क्वालिटी में PNG या SVG तुरंत डाउनलोड करें।' }
    ]
  },
  'barcode-generator': {
    stepsEn: [
      { step: 1, title: 'Enter Value', desc: 'Type product ID, registration number, or code.' },
      { step: 2, title: 'Pick Format', desc: 'Choose CODE128, EAN-13, or CODE39 standard.' },
      { step: 3, title: 'Save Barcode', desc: 'Download barcode image ready for labels and print.' }
    ],
    stepsHi: [
      { step: 1, title: 'कोड नंबर लिखें', desc: 'प्रोडक्ट ID, रोल नंबर या कोड दर्ज करें।' },
      { step: 2, title: 'फॉर्मेट चुनें', desc: 'CODE128, EAN-13 या CODE39 बारकोड चुनें।' },
      { step: 3, title: 'बारकोड डाउनलोड', desc: 'लेबल व प्रिंटिंग के लिए इमेज डाउनलोड करें।' }
    ]
  },
  calculators: {
    stepsEn: [
      { step: 1, title: 'Pick Calculator', desc: 'Select Age Cutoff, Bank EMI, GST (+/-), or % Marks.' },
      { step: 2, title: 'Enter Details', desc: 'Input date of birth, cutoff date, or loan amounts.' },
      { step: 3, title: 'Instant Calculation', desc: 'View exact breakdown (years/months/days, EMI, tax).' }
    ],
    stepsHi: [
      { step: 1, title: 'कैलकुलेटर चुनें', desc: 'सरकारी उम्र कट-ऑफ, बैंक EMI, GST या प्रतिशत चुनें।' },
      { step: 2, title: 'विवरण दर्ज करें', desc: 'जन्म तिथि, कट-ऑफ तिथि या लोन राशि भरें।' },
      { step: 3, title: 'सटीक परिणाम पाएं', desc: 'सटीक उम्र, मासिक किस्त या टैक्स का हिसाब तुरंत देखें।' }
    ]
  },
  'whatsapp-print': {
    stepsEn: [
      { step: 1, title: 'Configure Print', desc: 'Select Color/B&W, copies, double-sided, lamination.' },
      { step: 2, title: 'Review Summary', desc: 'Check total impressions and specifications.' },
      { step: 3, title: 'Dispatch WhatsApp', desc: 'Direct chat opens with shop; attach file for zero-wait printing.' }
    ],
    stepsHi: [
      { step: 1, title: 'प्रिंटिंग विवरण चुनें', desc: 'रंगीन/ब्लैक-व्हाइट, प्रतियों की संख्या, लेमिनेशन चुनें।' },
      { step: 2, title: 'ऑर्डर चेक करें', desc: 'कुल पेज और निर्देशों की समीक्षा करें।' },
      { step: 3, title: 'व्हाट्सएप पर भेजें', desc: 'मेराज कैफे पॉइंट के नंबर पर फाइल भेजकर जीरो-वेट प्रिंट लें।' }
    ]
  }
};

export const AllTools: React.FC = () => {
  const { language, selectedToolId, setSelectedToolId } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [quickGuideModalTool, setQuickGuideModalTool] = useState<ToolItem | null>(null);

  const filteredTools = TOOLS_LIST.filter((tool) => {
    const matchesCat = filterCategory === 'all' || tool.category === filterCategory;
    const q = search.toLowerCase().trim();
    const matchesQuery =
      !q ||
      tool.name.toLowerCase().includes(q) ||
      tool.nameHi.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.descriptionHi.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  const activeTool = TOOLS_LIST.find((t) => t.id === selectedToolId);

  const getToolIcon = (id: string) => {
    switch (id) {
      case 'compressor':
      case 'resizer':
        return <Camera className="w-5 h-5 text-orange-500" />;
      case 'passport':
        return <Camera className="w-5 h-5 text-orange-500" />;
      case 'signature':
        return <PenTool className="w-5 h-5 text-orange-500" />;
      case 'pdf-merge':
      case 'pdf-split':
      case 'img-to-pdf':
        return <Layers className="w-5 h-5 text-orange-500" />;
      case 'ocr':
        return <FileText className="w-5 h-5 text-orange-500" />;
      case 'qr-generator':
      case 'barcode-generator':
        return <QrCode className="w-5 h-5 text-orange-500" />;
      case 'calculators':
        return <Calculator className="w-5 h-5 text-orange-500" />;
      case 'whatsapp-print':
        return <Printer className="w-5 h-5 text-orange-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-orange-500" />;
    }
  };

  const renderActiveToolComponent = () => {
    switch (selectedToolId) {
      case 'compressor':
      case 'resizer':
      case 'image-suite':
        return <ImageToolsSuite />;
      case 'passport':
        return <PassportPhotoTool />;
      case 'signature':
        return <SignatureTool />;
      case 'pdf-merge':
        return <PdfMergeTool />;
      case 'pdf-split':
        return <PdfSplitterTool />;
      case 'img-to-pdf':
        return <PdfTools />;
      case 'ocr':
        return <OcrTool />;
      case 'qr-generator':
        return <QrCodeGeneratorTool />;
      case 'barcode-generator':
        return <QrBarcodeTool />;
      case 'calculators':
        return <CalculatorsTool />;
      case 'whatsapp-print':
        return <WhatsAppPrintTool />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* If a tool is selected, render the workbench with a back button */}
      {selectedToolId && activeTool ? (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedToolId(null)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl neu-btn text-slate-700 dark:text-slate-200 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-orange-500" />
              <span>{language === 'hi' ? 'सभी टूल्स पर वापस' : 'Back to All Tools'}</span>
            </button>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              {language === 'hi' ? activeTool.nameHi : activeTool.name}
            </span>
          </div>

          {renderActiveToolComponent()}
        </div>
      ) : (
        /* Tools Catalog View */
        <div className="space-y-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {language === 'hi' ? 'ऑनलाइन टूल्स डायरेक्टरी' : 'All Online Tools'}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              {language === 'hi'
                ? 'सरकारी फॉर्म, फोटो, सिग्नेचर, PDF और प्रिंटिंग के लिए 100% मुफ्त एवं प्राइवेट इन-ब्राउज़र टूल्स।'
                : '100% free, private in-browser digital tools for government jobs, exams, PDFs, and photo formatting.'}
            </p>
          </div>

          {/* Search & Filter Tabs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search Input with Neumorphic Inset */}
            <div className="relative w-full sm:w-80 neu-inset">
              <Search className="w-4 h-4 text-orange-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={language === 'hi' ? 'टूल्स खोजें (जैसे: फोटो, PDF, उम्र)...' : 'Search tools (e.g. photo, PDF, age)...'}
                className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            {/* Category Filter Pills (Neumorphic Inset Track with Tactile Buttons) */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl neu-inset-sm overflow-x-auto w-full sm:w-auto">
              {[
                { id: 'all', labelEn: 'All Tools', labelHi: 'सभी' },
                { id: 'image', labelEn: 'Photos', labelHi: 'फोटो' },
                { id: 'pdf', labelEn: 'PDFs', labelHi: 'PDF' },
                { id: 'document', labelEn: 'OCR Scan', labelHi: 'स्कैनर' },
                { id: 'qr_barcode', labelEn: 'QR & Barcode', labelHi: 'QR कोड' },
                { id: 'calculator', labelEn: 'Calculators', labelHi: 'कैलकुलेटर' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all min-h-[36px] ${
                    filterCategory === cat.id
                      ? 'neu-tab-active bg-[#E8EDF5] dark:bg-[#1B1E27] text-orange-600 dark:text-orange-400'
                      : 'neu-tab-idle'
                  }`}
                >
                  {language === 'hi' ? cat.labelHi : cat.labelEn}
                </button>
              ))}
            </div>

          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => setSelectedToolId(tool.id)}
                className="group p-5 rounded-2xl neu-card-hover cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl neu-icon group-hover:scale-105 transition-transform">
                      {getToolIcon(tool.id)}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* Quick Guide Trigger Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuickGuideModalTool(tool);
                        }}
                        className="neu-btn flex items-center gap-1 text-[11px] font-semibold text-orange-600 dark:text-orange-400 px-2.5 py-1 rounded-lg transition-colors"
                        title={language === 'hi' ? '3-स्टेप त्वरित गाइड' : '3-Step Quick Guide'}
                      >
                        <HelpCircle className="w-3 h-3 text-orange-500" />
                        <span>{language === 'hi' ? 'गाइड' : 'Guide'}</span>
                      </button>

                      {/* Status Badge */}
                      <div className="flex items-center gap-1 text-xs text-slate-500 pl-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="font-medium text-emerald-600 dark:text-emerald-400 text-[11px]">
                          {tool.status === 'working' ? 'Ready' : 'Draft'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {language === 'hi' ? tool.nameHi : tool.name}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-3 leading-relaxed">
                    {language === 'hi' ? tool.descriptionHi : tool.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="font-semibold text-orange-600 dark:text-orange-400 group-hover:underline">
                    {language === 'hi' ? 'टूल खोलें →' : 'Launch Tool →'}
                  </span>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">
                    100% In-Browser
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400 neu-card">
              No matching tools found for "{search}". Try searching for photo, pdf, or age.
            </div>
          )}

          {/* Quick Guide Modal with Neumorphic Card Styling */}
          {quickGuideModalTool && (
            <div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
              onClick={() => setQuickGuideModalTool(null)}
            >
              <div
                className="neu-card max-w-md w-full p-6 space-y-5 animate-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl neu-icon shrink-0">
                      {getToolIcon(quickGuideModalTool.id)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                        {language === 'hi' ? quickGuideModalTool.nameHi : quickGuideModalTool.name}
                      </h3>
                      <span className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 flex items-center gap-1 mt-0.5">
                        <BookOpen className="w-3 h-3" />
                        <span>{language === 'hi' ? 'त्वरित 3-स्टेप गाइड' : 'Quick 3-Step Guide'}</span>
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuickGuideModalTool(null)}
                    className="neu-btn p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    aria-label="Close Guide"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* 3 Step Stack */}
                <div className="space-y-3">
                  {(
                    (TOOL_GUIDES_DATA[quickGuideModalTool.id] || TOOL_GUIDES_DATA['compressor'])[
                      language === 'hi' ? 'stepsHi' : 'stepsEn'
                    ]
                  ).map((st) => (
                    <div
                      key={st.step}
                      className="p-3.5 rounded-xl neu-inset-sm flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-orange-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        {st.step}
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {st.title}
                        </h4>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                          {st.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setQuickGuideModalTool(null)}
                    className="flex-1 py-2.5 neu-btn text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors min-h-[44px]"
                  >
                    {language === 'hi' ? 'बंद करें' : 'Close'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const id = quickGuideModalTool.id;
                      setQuickGuideModalTool(null);
                      setSelectedToolId(id);
                    }}
                    className="flex-1 py-2.5 neu-btn-orange text-xs font-bold transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
                  >
                    <span>{language === 'hi' ? 'टूल खोलें' : 'Open Tool'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
