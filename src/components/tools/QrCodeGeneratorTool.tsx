import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import QRCode from 'qrcode';
import { 
  QrCode, 
  Download, 
  Copy, 
  Check, 
  Link as LinkIcon, 
  FileText, 
  MessageCircle, 
  CreditCard, 
  Wifi, 
  Printer, 
  HelpCircle, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink, 
  RotateCcw,
  Palette,
  Maximize2
} from 'lucide-react';

type InputMode = 'url' | 'text' | 'whatsapp' | 'upi' | 'wifi';

export const QrCodeGeneratorTool: React.FC = () => {
  const { language, shopSettings } = useApp();

  // Active Input Mode
  const [mode, setMode] = useState<InputMode>('url');

  // Input States
  const [urlInput, setUrlInput] = useState<string>('https://merajcafepoint.in');
  const [textInput, setTextInput] = useState<string>('Welcome to MERAJ CAFE POINT! Cyber Cafe & Digital Services.');
  
  // WhatsApp Mode
  const [waPhone, setWaPhone] = useState<string>(shopSettings.phone || '9060776981');
  const [waMessage, setWaMessage] = useState<string>('Hello Meraj Cafe, I need help with an online form.');

  // UPI Mode
  const [upiId, setUpiId] = useState<string>(shopSettings.upiId || '');
  const [upiPayee, setUpiPayee] = useState<string>(shopSettings.upiName || 'MERAJ CAFE POINT');
  const [upiAmount, setUpiAmount] = useState<string>('');

  // Wi-Fi Mode
  const [wifiSsid, setWifiSsid] = useState<string>('Meraj_Cafe_WiFi');
  const [wifiPassword, setWifiPassword] = useState<string>('');
  const [wifiEncryption, setWifiEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');

  // Customization Options
  const [fgColor, setFgColor] = useState<string>('#000000');
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [resolutionPx, setResolutionPx] = useState<number>(512); // 256, 512, 1024, 2048
  const [margin, setMargin] = useState<number>(2); // 1, 2, 4
  const [includeLabel, setIncludeLabel] = useState<boolean>(true);
  const [labelText, setLabelText] = useState<string>('SCAN WITH PHONE CAMERA');

  // Generated Outputs
  const [qrPngUrl, setQrPngUrl] = useState<string>('');
  const [qrSvgString, setQrSvgString] = useState<string>('');
  const [currentPayload, setCurrentPayload] = useState<string>('');
  const [copiedPayload, setCopiedPayload] = useState<boolean>(false);
  const [copiedImage, setCopiedImage] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compute standard payload string based on current mode
  const computePayload = (): string => {
    switch (mode) {
      case 'url': {
        const trimmed = urlInput.trim();
        if (!trimmed) return 'https://merajcafepoint.in';
        // Auto-prepend https:// if missing
        if (!/^https?:\/\//i.test(trimmed)) {
          return `https://${trimmed}`;
        }
        return trimmed;
      }
      case 'text':
        return textInput.trim() || 'MERAJ CAFE POINT';
      case 'whatsapp': {
        let cleaned = waPhone.replace(/\D/g, '');
        if (cleaned.length === 10) {
          cleaned = `91${cleaned}`;
        }
        const msg = encodeURIComponent(waMessage.trim());
        return `https://wa.me/${cleaned}${msg ? `?text=${msg}` : ''}`;
      }
      case 'upi': {
        let str = `upi://pay?pa=${encodeURIComponent(upiId.trim() || 'merajcafepoint@upi')}&pn=${encodeURIComponent(upiPayee.trim())}&cu=INR`;
        if (upiAmount && parseFloat(upiAmount) > 0) {
          str += `&am=${encodeURIComponent(upiAmount.trim())}`;
        }
        return str;
      }
      case 'wifi':
        return `WIFI:S:${wifiSsid.trim()};T:${wifiEncryption};P:${wifiPassword.trim()};;`;
      default:
        return 'https://merajcafepoint.in';
    }
  };

  // Generate QR code whenever inputs or styling change
  useEffect(() => {
    const payload = computePayload();
    setCurrentPayload(payload);
    setIsGenerating(true);

    // Generate high-resolution PNG
    QRCode.toDataURL(payload, {
      errorCorrectionLevel: errorCorrection,
      color: { dark: fgColor, light: bgColor },
      width: resolutionPx,
      margin: margin,
    })
      .then((url) => {
        setQrPngUrl(url);
        setIsGenerating(false);
      })
      .catch((err) => {
        console.error('QR PNG error:', err);
        setIsGenerating(false);
      });

    // Generate lossless SVG
    QRCode.toString(payload, {
      type: 'svg',
      errorCorrectionLevel: errorCorrection,
      color: { dark: fgColor, light: bgColor },
      margin: margin,
    })
      .then((svg) => {
        setQrSvgString(svg);
      })
      .catch((err) => {
        console.error('QR SVG error:', err);
      });
  }, [
    mode,
    urlInput,
    textInput,
    waPhone,
    waMessage,
    upiId,
    upiPayee,
    upiAmount,
    wifiSsid,
    wifiPassword,
    wifiEncryption,
    fgColor,
    bgColor,
    errorCorrection,
    resolutionPx,
    margin,
  ]);

  // Download PNG file
  const handleDownloadPng = () => {
    if (!qrPngUrl) return;
    const a = document.createElement('a');
    a.href = qrPngUrl;
    const cleanMode = mode === 'url' ? 'website' : mode;
    a.download = `meraj_cafe_qr_${cleanMode}_${resolutionPx}px.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Download SVG file
  const handleDownloadSvg = () => {
    if (!qrSvgString) return;
    const blob = new Blob([qrSvgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meraj_cafe_qr_${mode}_vector.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  // Copy raw payload text to clipboard
  const handleCopyPayload = async () => {
    try {
      await navigator.clipboard.writeText(currentPayload);
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Copy QR Code image directly to clipboard
  const handleCopyImage = async () => {
    if (!qrPngUrl) return;
    try {
      const res = await fetch(qrPngUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopiedImage(true);
      setTimeout(() => setCopiedImage(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Quick preset palette colors
  const colorPresets = [
    { name: 'Black', fg: '#000000', bg: '#FFFFFF' },
    { name: 'Cyber Orange', fg: '#EA580C', bg: '#FFFFFF' },
    { name: 'Navy Blue', fg: '#1E3A8A', bg: '#FFFFFF' },
    { name: 'Emerald', fg: '#047857', bg: '#FFFFFF' },
    { name: 'Deep Slate', fg: '#0F172A', bg: '#FFF7ED' },
  ];

  return (
    <div className="neu-card p-5 sm:p-7 space-y-6">
      
      {/* 1. Header with Title and Quick Guide Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/50 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl neu-icon">
              <QrCode className="w-5 h-5 text-orange-500" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {language === 'hi' ? 'QR कोड जनरेटर (टेक्स्ट एवं URL)' : 'QR Code Generator'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {language === 'hi'
              ? 'वेबसाइट URL, सामान्य टेक्स्ट, व्हाट्सएप या UPI के लिए तुरंत हाई-रिज़ॉल्यूशन QR कोड बनाएं एवं डाउनलोड करें।'
              : 'Generate high-resolution, downloadable QR codes for URLs, text, WhatsApp chat links, and UPI payments.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl neu-btn text-xs font-semibold"
          >
            <HelpCircle className="w-3.5 h-3.5 text-orange-500" />
            <span>{showGuide ? (language === 'hi' ? 'गाइड छिपाएं' : 'Hide Guide') : (language === 'hi' ? '3-स्टेप गाइड' : '3-Step Guide')}</span>
          </button>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg neu-inset-sm text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% In-Browser</span>
          </span>
        </div>
      </div>

      {/* Quick 3-Step Guide Collapsible Panel */}
      {showGuide && (
        <div className="p-4 rounded-2xl neu-inset space-y-3 animate-in fade-in duration-150">
          <span className="text-xs font-bold text-orange-950 dark:text-orange-200 uppercase tracking-wider block">
            {language === 'hi' ? 'QR कोड कैसे बनाएं (3 आसान चरण):' : 'How to Generate a QR Code (3 Simple Steps):'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 neu-card-sm space-y-1">
              <span className="font-bold text-orange-600 block">1. इनपुट टाइप चुनें</span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'hi'
                  ? 'वेबसाइट URL, सामान्य टेक्स्ट, व्हाट्सएप लिंक या UPI पेमेंट टैब सेलेक्ट करें।'
                  : 'Select Website URL, Plain Text, WhatsApp, or UPI Payment tab.'}
              </p>
            </div>
            <div className="p-3.5 neu-card-sm space-y-1">
              <span className="font-bold text-orange-600 block">2. टेक्स्ट या लिंक लिखें</span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'hi'
                  ? 'अपना लिंक या टेक्स्ट पेस्ट करें और रंग व रिज़ॉल्यूशन कस्टमाइज़ करें।'
                  : 'Type or paste your text or URL, and customize colors and size.'}
              </p>
            </div>
            <div className="p-3.5 neu-card-sm space-y-1">
              <span className="font-bold text-orange-600 block">3. PNG / SVG डाउनलोड करें</span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'hi'
                  ? 'HD PNG या वेक्टर SVG में डाउनलोड करें अथवा सीधे कॉपी/प्रिंट करें।'
                  : 'Download HD PNG image or lossless SVG vector instantly.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Workbench Layout (Inputs on Left, Live Preview on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Mode Selection + Input Form + Customizer */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Mode Tabs */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
              {language === 'hi' ? 'QR कोड का प्रकार चुनें:' : 'Select QR Code Type:'}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 p-1 rounded-2xl neu-inset-sm">
              {[
                { id: 'url', labelEn: 'Website URL', labelHi: 'वेबसाइट URL', icon: <LinkIcon className="w-3.5 h-3.5" /> },
                { id: 'text', labelEn: 'Plain Text', labelHi: 'सामान्य टेक्स्ट', icon: <FileText className="w-3.5 h-3.5" /> },
                { id: 'whatsapp', labelEn: 'WhatsApp', labelHi: 'व्हाट्सएप', icon: <MessageCircle className="w-3.5 h-3.5" /> },
                { id: 'upi', labelEn: 'UPI Payment', labelHi: 'UPI पेमेंट', icon: <CreditCard className="w-3.5 h-3.5" /> },
                { id: 'wifi', labelEn: 'Wi-Fi Network', labelHi: 'वाई-फाई', icon: <Wifi className="w-3.5 h-3.5" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setMode(tab.id as InputMode)}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-xl transition-all min-h-[38px] ${
                    mode === tab.id
                      ? 'neu-tab-active bg-[#E8EDF5] dark:bg-[#1B1E27] text-orange-600 dark:text-orange-400'
                      : 'neu-tab-idle'
                  }`}
                >
                  {tab.icon}
                  <span className="truncate">{language === 'hi' ? tab.labelHi : tab.labelEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mode Specific Inputs */}
          <div className="p-5 rounded-2xl neu-card-sm space-y-4">
            
            {/* 1. URL Mode */}
            {mode === 'url' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-orange-500" />
                    <span>{language === 'hi' ? 'वेबसाइट URL दर्ज करें:' : 'Website / Link URL:'}</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {urlInput.length} chars
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/your-form"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm neu-input font-mono"
                  />
                  {urlInput && (
                    <button
                      type="button"
                      onClick={() => setUrlInput('')}
                      className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span>Quick examples:</span>
                  <button
                    type="button"
                    onClick={() => setUrlInput('https://serviceonline.bihar.gov.in')}
                    className="text-orange-600 dark:text-orange-400 hover:underline font-mono"
                  >
                    RTPS Bihar
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => setUrlInput('https://ssc.gov.in')}
                    className="text-orange-600 dark:text-orange-400 hover:underline font-mono"
                  >
                    SSC Portal
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => setUrlInput('https://goo.gl/maps/Du7Zmka1h91PL9HF8?g_st=ac')}
                    className="text-orange-600 dark:text-orange-400 hover:underline font-mono"
                  >
                    Shop Map
                  </button>
                </div>
              </div>
            )}

            {/* 2. Plain Text Mode */}
            {mode === 'text' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-orange-500" />
                    <span>{language === 'hi' ? 'सामान्य टेक्स्ट या संदेश:' : 'Plain Text or Notice:'}</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {textInput.length} chars
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={language === 'hi' ? 'यहाँ कोई भी टेक्स्ट, सूचना या रोल नंबर लिखें...' : 'Type any text, message, or roll number to encode...'}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm neu-input"
                />
              </div>
            )}

            {/* 3. WhatsApp Mode */}
            {mode === 'whatsapp' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                    {language === 'hi' ? 'मोबाइल नंबर (10 अंक):' : 'Phone Number (10 digits):'}
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-2 text-xs font-bold neu-inset-sm text-slate-700 dark:text-slate-300 rounded-xl font-mono">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={waPhone}
                      onChange={(e) => setWaPhone(e.target.value)}
                      placeholder="9060776981"
                      className="w-full px-3.5 py-2 text-xs sm:text-sm neu-input font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                    {language === 'hi' ? 'शुरुआती चैट संदेश (Pre-filled message):' : 'Pre-filled Chat Message:'}
                  </label>
                  <input
                    type="text"
                    value={waMessage}
                    onChange={(e) => setWaMessage(e.target.value)}
                    placeholder="Hello, I want to print documents."
                    className="w-full px-3.5 py-2 text-xs sm:text-sm neu-input"
                  />
                </div>
              </div>
            )}

            {/* 4. UPI Payment Mode */}
            {mode === 'upi' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                      {language === 'hi' ? 'UPI ID (VPA):' : 'UPI ID (VPA):'}
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="9060776981@paytm"
                      className="w-full px-3.5 py-2 text-xs neu-input font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                      {language === 'hi' ? 'दुकानदार / प्राप्तकर्ता का नाम:' : 'Payee Name:'}
                    </label>
                    <input
                      type="text"
                      value={upiPayee}
                      onChange={(e) => setUpiPayee(e.target.value)}
                      placeholder="MERAJ CAFE POINT"
                      className="w-full px-3.5 py-2 text-xs neu-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                    {language === 'hi' ? 'निश्चित राशि (वैकल्पिक, खाली छोड़ें अगर ग्राहक खुद भरेगा):' : 'Fixed Amount in ₹ (Optional, leave blank for any amount):'}
                  </label>
                  <input
                    type="number"
                    value={upiAmount}
                    onChange={(e) => setUpiAmount(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full px-3.5 py-2 text-xs neu-input font-mono"
                  />
                </div>
              </div>
            )}

            {/* 5. Wi-Fi Mode */}
            {mode === 'wifi' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                      {language === 'hi' ? 'Wi-Fi नेटवर्क नाम (SSID):' : 'Wi-Fi Network Name (SSID):'}
                    </label>
                    <input
                      type="text"
                      value={wifiSsid}
                      onChange={(e) => setWifiSsid(e.target.value)}
                      placeholder="Meraj_Cafe_WiFi"
                      className="w-full px-3.5 py-2 text-xs neu-input"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                      {language === 'hi' ? 'सिक्योरिटी प्रकार:' : 'Encryption:'}
                    </label>
                    <select
                      value={wifiEncryption}
                      onChange={(e) => setWifiEncryption(e.target.value as any)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl neu-input font-semibold"
                    >
                      <option value="WPA">WPA / WPA2 / WPA3 (Standard)</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">None / Open</option>
                    </select>
                  </div>
                </div>

                {wifiEncryption !== 'nopass' && (
                  <div>
                    <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                      {language === 'hi' ? 'Wi-Fi पासवर्ड:' : 'Wi-Fi Password:'}
                    </label>
                    <input
                      type="text"
                      value={wifiPassword}
                      onChange={(e) => setWifiPassword(e.target.value)}
                      placeholder="Enter network password"
                      className="w-full px-3.5 py-2 text-xs neu-input font-mono"
                    />
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Customization Accordion/Section */}
          <div className="p-5 rounded-2xl neu-card-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/60 dark:border-white/5">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-orange-500" />
                <span>{language === 'hi' ? 'QR स्टाइल व रिज़ॉल्यूशन सेटिंग्स' : 'Design & Resolution Options'}</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setFgColor('#000000');
                  setBgColor('#FFFFFF');
                  setErrorCorrection('M');
                  setResolutionPx(512);
                  setMargin(2);
                }}
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Quick Color Presets */}
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
                {language === 'hi' ? 'रंग प्रीसेट:' : 'Color Palette Presets:'}
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {colorPresets.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => {
                      setFgColor(p.fg);
                      setBgColor(p.bg);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      fgColor === p.fg && bgColor === p.bg
                        ? 'neu-tab-active bg-[#E8EDF5] dark:bg-[#1B1E27] text-orange-600 dark:text-orange-400'
                        : 'neu-btn text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-slate-300 shrink-0"
                      style={{ backgroundColor: p.fg }}
                    />
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Color Pickers */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  {language === 'hi' ? 'QR रंग (Foreground):' : 'QR Pattern Color:'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0"
                  />
                  <input
                    type="text"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-full px-2 py-1 text-xs font-mono uppercase rounded-lg neu-input"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  {language === 'hi' ? 'बैकग्राउंड रंग:' : 'Background Color:'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-full px-2 py-1 text-xs font-mono uppercase rounded-lg neu-input"
                  />
                </div>
              </div>
            </div>

            {/* Resolution and Error Correction */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  {language === 'hi' ? 'डाउनलोड इमेज साइज (रिज़ॉल्यूशन):' : 'Output Resolution (PNG):'}
                </label>
                <select
                  value={resolutionPx}
                  onChange={(e) => setResolutionPx(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2 text-xs neu-input font-medium"
                >
                  <option value={256}>256 × 256 px (Web & Screen)</option>
                  <option value={512}>512 × 512 px (Standard HD - Recommended)</option>
                  <option value={1024}>1024 × 1024 px (High Quality Print)</option>
                  <option value={2048}>2048 × 2048 px (Ultra HD Banner / Flex)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  {language === 'hi' ? 'त्रुटि सुधार (Error Correction):' : 'Error Correction Level:'}
                </label>
                <select
                  value={errorCorrection}
                  onChange={(e) => setErrorCorrection(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs neu-input font-medium"
                >
                  <option value="L">Level L (~7% damage recovery)</option>
                  <option value="M">Level M (~15% recovery - Standard)</option>
                  <option value="Q">Level Q (~25% recovery - Rugged)</option>
                  <option value="H">Level H (~30% recovery - Max durability)</option>
                </select>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Live Interactive Card + Download Suite */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="p-6 rounded-2xl neu-card text-center space-y-4">
            
            <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200/50 dark:border-slate-800">
              <span className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>Live QR Preview</span>
              </span>
              <span className="font-mono text-[11px] neu-inset-sm px-2 py-0.5 rounded-lg text-slate-700 dark:text-slate-300">
                {resolutionPx}px · Level {errorCorrection}
              </span>
            </div>

            {/* The QR Display Card */}
            <div 
              className="inline-block p-5 rounded-2xl neu-card max-w-full transition-all"
              style={{ backgroundColor: bgColor }}
            >
              {qrPngUrl ? (
                <div className="space-y-2">
                  <img
                    src={qrPngUrl}
                    alt="Generated QR Code"
                    className="w-56 h-56 sm:w-64 sm:h-64 object-contain mx-auto"
                  />
                  {includeLabel && (
                    <div 
                      className="text-center font-bold tracking-wider text-[11px] pt-1 border-t border-slate-200/40"
                      style={{ color: fgColor }}
                    >
                      MERAJ CAFE POINT
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-xs text-slate-400">
                  Generating QR...
                </div>
              )}
            </div>

            {/* Encoded Data Snapshot */}
            <div className="p-3 rounded-xl neu-inset-sm text-left space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-semibold uppercase tracking-wider">Encoded Payload:</span>
                <button
                  type="button"
                  onClick={handleCopyPayload}
                  className="hover:text-orange-600 text-slate-500 flex items-center gap-1 text-[11px]"
                >
                  {copiedPayload ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedPayload ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs font-mono text-slate-700 dark:text-slate-300 truncate max-w-full">
                {currentPayload}
              </p>
            </div>

            {/* Download Buttons Stack */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleDownloadPng}
                className="w-full py-3 px-4 neu-btn-orange text-xs font-bold flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Download className="w-4 h-4" />
                <span>{language === 'hi' ? `डाउनलोड HD PNG (${resolutionPx}px)` : `Download HD PNG (${resolutionPx}px)`}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDownloadSvg}
                  className="py-2.5 px-3 neu-btn text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 min-h-[44px]"
                >
                  <Download className="w-3.5 h-3.5 text-orange-500" />
                  <span>Download SVG</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyImage}
                  className="py-2.5 px-3 neu-btn text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 min-h-[44px]"
                >
                  {copiedImage ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600">Copied Image</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Image</span>
                    </>
                  )}
                </button>
              </div>

              {/* Direct Print Button */}
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full py-2 px-3 text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'दुकान काउंटर के लिए प्रिंट करें' : 'Print QR Badge for Shop Counter'}</span>
              </button>
            </div>

          </div>

          {/* Quick Tips Box */}
          <div className="p-4 rounded-2xl neu-inset-sm text-[11px] text-amber-900 dark:text-amber-300 space-y-1">
            <span className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-400">
              <span>💡</span>
              <span>{language === 'hi' ? 'साइबर कैफे सुझाव:' : 'Cyber Cafe Tip:'}</span>
            </span>
            <p className="leading-relaxed">
              {language === 'hi'
                ? 'कांच या प्लास्टिक लेमिनेशन के लिए हमेशा लेवल Q या H और 1024px+ साइज का उपयोग करें ताकि फोन कैमरा आसानी से स्कैन कर सके।'
                : 'For shop counter stickers and laminated badges, use Level Q/H error correction and 1024px+ for fast scanning in any lighting.'}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
