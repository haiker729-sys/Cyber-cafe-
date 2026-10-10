import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { cleanSignature, compressImageToTargetKb, loadImage } from '../../utils/imageProcess.ts';
import { injectJfifDpi } from '../../utils/jfifDpi.ts';
import { Upload, Download, RefreshCw, Wand2, Sliders, CheckCircle } from 'lucide-react';

export const SignatureTool: React.FC = () => {
  const { language } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  // Preset sizes
  const [widthPx, setWidthPx] = useState<number>(140);
  const [heightPx, setHeightPx] = useState<number>(60);
  const [targetKb, setTargetKb] = useState<number>(15);

  // Clean-up controls
  const [cleanBg, setCleanBg] = useState<boolean>(true);
  const [threshold, setThreshold] = useState<number>(205); // 0-255
  const [darkenFactor, setDarkenFactor] = useState<number>(1.4);

  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultKb, setResultKb] = useState<number>(0);
  const [processing, setProcessing] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setImageSrc(url);
    setResultUrl(null);
  };

  const processSignature = async () => {
    if (!imageSrc) return;
    setProcessing(true);

    try {
      const rawImg = await loadImage(imageSrc);

      let processedCanvas: HTMLCanvasElement;
      if (cleanBg) {
        processedCanvas = await cleanSignature(rawImg, threshold, darkenFactor);
      } else {
        processedCanvas = document.createElement('canvas');
        processedCanvas.width = rawImg.naturalWidth;
        processedCanvas.height = rawImg.naturalHeight;
        const ctx = processedCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, processedCanvas.width, processedCanvas.height);
          ctx.drawImage(rawImg, 0, 0);
        }
      }

      // Resize to target dimensions
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = widthPx;
      finalCanvas.height = heightPx;
      const ctx = finalCanvas.getContext('2d');
      if (!ctx) throw new Error('Context error');

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, widthPx, heightPx);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw fitted signature
      const aspect = processedCanvas.width / processedCanvas.height;
      const targetAspect = widthPx / heightPx;
      let drawW = widthPx;
      let drawH = heightPx;

      if (aspect > targetAspect) {
        drawH = widthPx / aspect;
      } else {
        drawW = heightPx * aspect;
      }

      const posX = (widthPx - drawW) / 2;
      const posY = (heightPx - drawH) / 2;
      ctx.drawImage(processedCanvas, posX, posY, drawW, drawH);

      // Binary search target KB compression
      const finalBlob = await new Promise<Blob>((resolve, reject) => {
        finalCanvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error('Blob failed'))),
          'image/jpeg',
          0.85
        );
      });

      const compressed = await compressImageToTargetKb(
        new File([finalBlob], 'sig.jpg', { type: 'image/jpeg' }),
        { targetKb, format: 'image/jpeg', dpi: 200 }
      );

      setResultUrl(compressed.dataUrl);
      setResultKb(compressed.sizeKb);
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (imageSrc) {
      processSignature();
    }
  }, [imageSrc, widthPx, heightPx, targetKb, cleanBg, threshold, darkenFactor]);

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `signature_${widthPx}x${heightPx}_${resultKb}kb.jpg`;
    a.click();
  };

  return (
    <div className="neu-card p-5 sm:p-7">
      <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-200/50 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {language === 'hi' ? 'सिग्नेचर रीसाइज़र और क्लीनर' : 'Signature Resizer & Cleaner'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'hi'
              ? 'सटीक पिक्सल साइज (140x60px), 10-20KB टारगेट और सफेद बैकग्राउंड के साथ सिग्नेचर साफ करें'
              : 'Exact dimensions (e.g. 140x60px), 10-20KB target, clean white paper, and dark ink contrast'}
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
            {language === 'hi' ? 'हस्ताक्षर (Signature) की फोटो अपलोड करें' : 'Upload Signature Photo'}
          </span>
          <span className="text-xs text-slate-500 mt-1">Photo of signed paper (JPG, PNG)</span>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Controls Column */}
          <div className="md:col-span-5 space-y-4">
            
            {/* Quick Dimensions Presets */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {language === 'hi' ? 'सटीक पिक्सल साइज चुनें' : 'Preset Dimensions'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { w: 140, h: 60, label: '140×60', tag: 'SSC / BSSC' },
                  { w: 200, h: 60, label: '200×60', tag: 'Railway' },
                  { w: 160, h: 70, label: '160×70', tag: 'Standard' },
                ].map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setWidthPx(p.w);
                      setHeightPx(p.h);
                    }}
                    className={`p-2 rounded-xl text-xs font-semibold transition-all ${
                      widthPx === p.w && heightPx === p.h
                        ? 'neu-btn-orange'
                        : 'neu-btn text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {p.label}
                    <span className="block text-[10px] opacity-80">{p.tag}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom W x H & Target KB */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Width (px)
                </label>
                <input
                  type="number"
                  value={widthPx}
                  onChange={(e) => setWidthPx(parseInt(e.target.value) || 140)}
                  className="w-full px-2.5 py-1.5 text-xs neu-input font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Height (px)
                </label>
                <input
                  type="number"
                  value={heightPx}
                  onChange={(e) => setHeightPx(parseInt(e.target.value) || 60)}
                  className="w-full px-2.5 py-1.5 text-xs neu-input font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Max KB
                </label>
                <input
                  type="number"
                  value={targetKb}
                  onChange={(e) => setTargetKb(parseInt(e.target.value) || 15)}
                  className="w-full px-2.5 py-1.5 text-xs neu-input font-mono"
                />
              </div>
            </div>

            {/* Clean-up Options */}
            <div className="p-3.5 rounded-2xl neu-card-sm space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cleanBg}
                  onChange={(e) => setCleanBg(e.target.checked)}
                  className="rounded text-orange-500 focus:ring-orange-500 w-4 h-4"
                />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5 text-orange-500" />
                  {language === 'hi' ? 'सफेद बैकग्राउंड और गहरी स्याही' : 'Clean White Paper & Darken Ink'}
                </span>
              </label>

              {cleanBg && (
                <div className="space-y-2 pt-1 border-t border-white/60 dark:border-white/5">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Paper Brightness Filter</span>
                    <span className="font-mono">{threshold}</span>
                  </div>
                  <input
                    type="range"
                    min="150"
                    max="240"
                    value={threshold}
                    onChange={(e) => setThreshold(parseInt(e.target.value))}
                    className="w-full accent-orange-500"
                  />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setFile(null);
                setImageSrc(null);
                setResultUrl(null);
              }}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline block"
            >
              {language === 'hi' ? 'दूसरा सिग्नेचर अपलोड करें' : 'Change signature file'}
            </button>
          </div>

          {/* Preview Column */}
          <div className="md:col-span-7 flex flex-col items-center justify-center neu-inset p-6 rounded-2xl">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              {language === 'hi' ? 'फाइनल सिग्नेचर प्रीव्यू' : 'Processed Signature Preview'}
            </span>

            <div className="p-4 bg-white dark:bg-slate-950 rounded-xl neu-card-sm flex items-center justify-center my-3 min-w-[200px]">
              {processing ? (
                <div className="flex items-center gap-2 text-xs text-slate-500 py-4">
                  <RefreshCw className="w-4 h-4 animate-spin text-orange-500" />
                  <span>Processing...</span>
                </div>
              ) : resultUrl ? (
                <img
                  src={resultUrl}
                  alt="Processed signature"
                  className="max-h-24 object-contain rounded-md"
                  style={{ width: `${widthPx}px`, height: `${heightPx}px` }}
                />
              ) : null}
            </div>

            {resultUrl && (
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="font-mono tabular-nums font-semibold">
                    {widthPx}×{heightPx}px · {resultKb} KB (Under {targetKb} KB)
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-6 py-2.5 neu-btn-orange text-xs font-bold flex items-center gap-2 mx-auto min-h-[44px]"
                >
                  <Download className="w-4 h-4" />
                  <span>{language === 'hi' ? 'साफ सिग्नेचर डाउनलोड करें' : 'Download Signature'}</span>
                </button>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};
