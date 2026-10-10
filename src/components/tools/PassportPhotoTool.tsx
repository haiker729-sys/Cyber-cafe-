import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { generatePassportPrintSheet, compressImageToTargetKb, loadImage } from '../../utils/imageProcess.ts';
import { injectJfifDpi } from '../../utils/jfifDpi.ts';
import { Upload, Download, Printer, RefreshCw, ZoomIn, ZoomOut, Check, Sliders } from 'lucide-react';

export const PassportPhotoTool: React.FC = () => {
  const { language } = useApp();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  // Preset aspect ratio: 35x45 mm (standard Indian Passport = 7:9 ratio)
  const [preset, setPreset] = useState<'35x45' | '2x2' | '30x40'>('35x45');
  const [dpi, setDpi] = useState<number>(300);
  const [bgColor, setBgColor] = useState<string>('original'); // 'original', '#ffffff', '#93c5fd', '#e2e8f0'
  const [zoom, setZoom] = useState<number>(1);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);

  const [singlePhotoUrl, setSinglePhotoUrl] = useState<string | null>(null);
  const [singlePhotoKb, setSinglePhotoKb] = useState<number>(0);
  const [printSheetUrl, setPrintSheetUrl] = useState<string | null>(null);
  const [sheetType, setSheetType] = useState<'4x6' | 'a4'>('4x6');
  const [sheetProcessing, setSheetProcessing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDragging = useRef<boolean>(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Handle file select
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
    setPrintSheetUrl(null);
  };

  // Dimensions based on preset
  const getDimsMm = () => {
    if (preset === '2x2') return { widthMm: 50.8, heightMm: 50.8, aspect: 1 };
    if (preset === '30x40') return { widthMm: 30, heightMm: 40, aspect: 30 / 40 };
    return { widthMm: 35, heightMm: 45, aspect: 35 / 45 };
  };

  // Render passport crop to canvas whenever zoom/offset/bg changes
  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = async () => {
      const { widthMm, heightMm, aspect } = getDimsMm();
      const targetWidthPx = Math.round((widthMm / 25.4) * dpi);
      const targetHeightPx = Math.round((heightMm / 25.4) * dpi);

      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = targetWidthPx;
      canvas.height = targetHeightPx;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Fill background
      if (bgColor === 'original') {
        ctx.fillStyle = '#FFFFFF';
      } else {
        ctx.fillStyle = bgColor;
      }
      ctx.fillRect(0, 0, targetWidthPx, targetHeightPx);

      ctx.save();
      ctx.translate(targetWidthPx / 2 + offsetX, targetHeightPx / 2 + offsetY);
      ctx.scale(zoom, zoom);

      // Fit image cover
      const imgAspect = img.naturalWidth / img.naturalHeight;
      let drawW = targetWidthPx;
      let drawH = targetHeightPx;
      if (imgAspect > aspect) {
        drawW = targetHeightPx * imgAspect;
      } else {
        drawH = targetWidthPx / imgAspect;
      }

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      // Convert to blob and measure KB
      canvas.toBlob(
        async (blob) => {
          if (!blob) return;
          const jfifBlob = await injectJfifDpi(blob, dpi);
          const url = URL.createObjectURL(jfifBlob);
          setSinglePhotoUrl(url);
          setSinglePhotoKb(Math.round((jfifBlob.size / 1024) * 10) / 10);
        },
        'image/jpeg',
        0.92
      );
    };
  }, [imageSrc, preset, dpi, bgColor, zoom, offsetX, offsetY]);

  // Mouse / Touch Drag handlers for positioning photo
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX - offsetX, y: e.clientY - offsetY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    setOffsetX(e.clientX - dragStart.current.x);
    setOffsetY(e.clientY - dragStart.current.y);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Generate Print Sheet
  const generateSheet = async () => {
    if (!singlePhotoUrl) return;
    setSheetProcessing(true);
    try {
      const { widthMm, heightMm } = getDimsMm();
      const sheetBlob = await generatePassportPrintSheet(
        singlePhotoUrl,
        sheetType,
        widthMm,
        heightMm,
        dpi
      );
      const url = URL.createObjectURL(sheetBlob);
      setPrintSheetUrl(url);
    } catch (e) {
      console.error(e);
    } finally {
      setSheetProcessing(false);
    }
  };

  const downloadSingle = () => {
    if (!singlePhotoUrl) return;
    const a = document.createElement('a');
    a.href = singlePhotoUrl;
    a.download = `passport_photo_${preset}_${dpi}dpi.jpg`;
    a.click();
  };

  const downloadSheet = () => {
    if (!printSheetUrl) return;
    const a = document.createElement('a');
    a.href = printSheetUrl;
    a.download = `meraj_cafe_print_sheet_${sheetType}.jpg`;
    a.click();
  };

  return (
    <div className="neu-card p-5 sm:p-7">
      <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-200/50 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {language === 'hi' ? 'पासपोर्ट फोटो और प्रिंट शीट मेकर' : 'Passport Photo & Print Sheet Maker'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'hi'
              ? '35x45mm मानक आकार, 300 DPI, ड्रैग-ज़ूम क्रॉप, और 4x6 / A4 प्रिंटेबल कट-मार्क शीट'
              : 'Standard 35x45mm sizing, 300 DPI JFIF metadata, zoom crop, and 4x6 / A4 print sheets'}
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg neu-inset-sm text-emerald-600 dark:text-emerald-400 shrink-0">
          Ready
        </span>
      </div>

      {!imageSrc ? (
        <label className="flex flex-col items-center justify-center p-8 sm:p-12 neu-card-hover border-2 border-dashed border-orange-400/30 rounded-2xl cursor-pointer transition-all group">
          <div className="w-14 h-14 rounded-2xl neu-icon mb-3 group-hover:scale-105 transition-transform">
            <Upload className="w-7 h-7 text-orange-500" />
          </div>
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {language === 'hi' ? 'पासपोर्ट फोटो के लिए तस्वीर अपलोड करें' : 'Upload Photo for Passport Maker'}
          </span>
          <span className="text-xs text-slate-500 mt-1">Selfie or portrait photo (JPG, PNG)</span>
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Presets */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {language === 'hi' ? 'आकार प्रीसेट (Size Preset)' : 'Size Preset'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPreset('35x45')}
                  className={`p-2.5 rounded-xl text-xs font-semibold transition-all ${
                    preset === '35x45'
                      ? 'neu-btn-orange'
                      : 'neu-btn text-slate-700 dark:text-slate-300'
                  }`}
                >
                  35×45 mm
                  <span className="block text-[10px] font-normal opacity-85">India / Exam</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreset('2x2')}
                  className={`p-2.5 rounded-xl text-xs font-semibold transition-all ${
                    preset === '2x2'
                      ? 'neu-btn-orange'
                      : 'neu-btn text-slate-700 dark:text-slate-300'
                  }`}
                >
                  2×2 inch
                  <span className="block text-[10px] font-normal opacity-85">US / OCI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreset('30x40')}
                  className={`p-2.5 rounded-xl text-xs font-semibold transition-all ${
                    preset === '30x40'
                      ? 'neu-btn-orange'
                      : 'neu-btn text-slate-700 dark:text-slate-300'
                  }`}
                >
                  30×40 mm
                  <span className="block text-[10px] font-normal opacity-85">Stamp Size</span>
                </button>
              </div>
            </div>

            {/* DPI & Background Color */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  DPI Quality
                </label>
                <select
                  value={dpi}
                  onChange={(e) => setDpi(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs neu-input font-medium"
                >
                  <option value={300}>300 DPI (Standard Print)</option>
                  <option value={200}>200 DPI (Web Upload)</option>
                  <option value={600}>600 DPI (Ultra Fine)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  {language === 'hi' ? 'बैकग्राउंड टोन' : 'Background Tone'}
                </label>
                <div className="flex items-center gap-2 pt-1">
                  {[
                    { id: 'original', color: 'transparent', label: 'Orig' },
                    { id: '#ffffff', color: '#ffffff', label: 'White' },
                    { id: '#93c5fd', color: '#93c5fd', label: 'Blue' },
                    { id: '#e2e8f0', color: '#e2e8f0', label: 'Grey' },
                  ].map((bg) => (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => setBgColor(bg.id)}
                      className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                        bgColor === bg.id ? 'border-orange-500 scale-110' : 'border-slate-300 dark:border-slate-600'
                      }`}
                      style={{ backgroundColor: bg.id === 'original' ? '#f1f5f9' : bg.color }}
                      title={bg.label}
                    >
                      {bgColor === bg.id && <Check className="w-3.5 h-3.5 text-slate-900" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Zoom Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                <span className="flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5" />
                  {language === 'hi' ? 'ज़ूम और एडजस्टमेंट' : 'Zoom Level'}
                </span>
                <span className="font-mono tabular-nums">{Math.round(zoom * 100)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
                  className="p-1.5 rounded-xl neu-btn text-slate-600 dark:text-slate-300"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1 accent-orange-500"
                />
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
                  className="p-1.5 rounded-xl neu-btn text-slate-600 dark:text-slate-300"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
              <span className="text-[11px] text-slate-500 block mt-1">
                {language === 'hi'
                  ? 'चेहरा सेंटर में करने के लिए फोटो को माउस से ड्रैग (खींचें) कर सकते हैं।'
                  : 'Click and drag the preview image to center your face.'}
              </span>
            </div>

            {/* Print Sheet Options */}
            <div className="pt-3 border-t border-white/60 dark:border-white/5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {language === 'hi' ? 'प्रिंट शीट तैयार करें (Multi-Copy Sheet)' : 'Create Print Sheet'}
              </label>
              
              <div className="flex items-center gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setSheetType('4x6')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                    sheetType === '4x6'
                      ? 'neu-tab-active bg-[#E8EDF5] dark:bg-[#1B1E27] text-orange-600 dark:text-orange-400'
                      : 'neu-btn text-slate-700 dark:text-slate-300'
                  }`}
                >
                  4×6 Inch Sheet (6-8 Copies)
                </button>
                <button
                  type="button"
                  onClick={() => setSheetType('a4')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                    sheetType === 'a4'
                      ? 'neu-tab-active bg-[#E8EDF5] dark:bg-[#1B1E27] text-orange-600 dark:text-orange-400'
                      : 'neu-btn text-slate-700 dark:text-slate-300'
                  }`}
                >
                  A4 Page (30+ Copies)
                </button>
              </div>

              <button
                type="button"
                onClick={generateSheet}
                disabled={sheetProcessing}
                className="w-full py-2.5 neu-btn text-orange-600 dark:text-orange-400 font-bold text-xs flex items-center justify-center gap-2 min-h-[40px]"
              >
                {sheetProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Printer className="w-3.5 h-3.5" />}
                <span>
                  {language === 'hi' ? `प्रिंट शीट बनाएं (${sheetType.toUpperCase()})` : `Generate ${sheetType.toUpperCase()} Sheet`}
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setImageFile(null);
                setImageSrc(null);
                setSinglePhotoUrl(null);
                setPrintSheetUrl(null);
              }}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline pt-2 block"
            >
              {language === 'hi' ? 'दूसरी फोटो चुनें' : 'Choose another photo'}
            </button>
          </div>

          {/* Interactive Preview Canvas Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center neu-inset p-5 rounded-2xl">
            
            <div className="text-center mb-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                {language === 'hi' ? 'लाइव पासपोर्ट प्रीव्यू (ड्रैग करके सेट करें)' : 'Live Passport View (Drag to adjust)'}
              </span>
              <span className="text-[11px] text-slate-500">
                {preset} · {dpi} DPI · {singlePhotoKb} KB
              </span>
            </div>

            {/* Draggable Frame Container */}
            <div
              className="relative border-2 border-orange-500/80 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing shadow-lg bg-white select-none"
              style={{
                width: preset === '2x2' ? 240 : 210,
                height: preset === '2x2' ? 240 : 270,
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Target Outline Guide */}
              <div className="absolute inset-0 pointer-events-none border border-slate-300/60 grid grid-rows-3 grid-cols-3">
                <div className="border-b border-r border-slate-300/30" />
                <div className="border-b border-r border-slate-300/30" />
                <div className="border-b border-slate-300/30" />
                <div className="border-b border-r border-slate-300/30" />
                <div className="border-b border-r border-slate-300/30" />
                <div className="border-b border-slate-300/30" />
                <div className="border-r border-slate-300/30" />
                <div className="border-r border-slate-300/30" />
                <div />
              </div>

              {singlePhotoUrl && (
                <img
                  src={singlePhotoUrl}
                  alt="Passport preview"
                  className="w-full h-full object-cover pointer-events-none"
                />
              )}
            </div>

            {/* Download Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
              <button
                type="button"
                onClick={downloadSingle}
                className="px-5 py-2.5 neu-btn-orange text-xs font-bold flex items-center gap-2 min-h-[44px]"
              >
                <Download className="w-4 h-4" />
                <span>{language === 'hi' ? 'सिंगल पासपोर्ट फोटो डाउनलोड' : 'Download Single Photo'}</span>
              </button>

              {printSheetUrl && (
                <button
                  type="button"
                  onClick={downloadSheet}
                  className="px-5 py-2.5 neu-btn text-slate-900 dark:text-white font-bold text-xs flex items-center gap-2 min-h-[44px]"
                >
                  <Printer className="w-4 h-4 text-orange-500" />
                  <span>{language === 'hi' ? 'प्रिंट शीट डाउनलोड करें' : 'Download Print Sheet'}</span>
                </button>
              )}
            </div>

            {/* Print Sheet thumbnail if generated */}
            {printSheetUrl && (
              <div className="mt-4 p-3.5 neu-card-sm text-center max-w-xs">
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Ready Sheet Preview ({sheetType.toUpperCase()})
                </span>
                <img src={printSheetUrl} alt="Sheet" className="max-h-36 mx-auto rounded-lg border border-slate-300/50" />
              </div>
            )}

          </div>

        </div>
      )}
    </div>
  );
};
