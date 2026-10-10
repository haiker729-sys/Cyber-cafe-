import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { loadImage, compressImageToTargetKb } from '../../utils/imageProcess.ts';
import { injectJfifDpi } from '../../utils/jfifDpi.ts';
import { Upload, Download, RefreshCw, CheckCircle, Sliders } from 'lucide-react';

export const ImageResizeConvertTool: React.FC = () => {
  const { language } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [origW, setOrigW] = useState<number>(0);
  const [origH, setOrigH] = useState<number>(0);
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [keepAspect, setKeepAspect] = useState<boolean>(true);
  const [format, setFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [dpi, setDpi] = useState<number>(300);
  const [quality, setQuality] = useState<number>(90);

  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultKb, setResultKb] = useState<number>(0);
  const [processing, setProcessing] = useState<boolean>(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    setResultUrl(null);

    const img = await loadImage(f);
    setOrigW(img.naturalWidth);
    setOrigH(img.naturalHeight);
    setWidth(img.naturalWidth);
    setHeight(img.naturalHeight);
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (keepAspect && origW > 0 && origH > 0) {
      setHeight(Math.round((val / origW) * origH));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (keepAspect && origW > 0 && origH > 0) {
      setWidth(Math.round((val / origH) * origW));
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    setProcessing(true);

    try {
      const img = await loadImage(file);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D failed');

      if (format === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      let blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error('ToBlob failed'))),
          format,
          quality / 100
        );
      });

      if (format === 'image/jpeg') {
        blob = await injectJfifDpi(blob, dpi);
      }

      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setResultKb(Math.round((blob.size / 1024) * 10) / 10);
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/png' ? 'png' : 'webp';
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `meraj_cafe_${width}x${height}_${dpi}dpi.${ext}`;
    a.click();
  };

  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {language === 'hi' ? 'इमेज रीसाइज़र और DPI कनवर्टर' : 'Image Resizer & DPI Converter'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'hi'
              ? 'सटीक पिक्सल साइज बदलें, 300 DPI जोड़ें और JPG, PNG या WebP में बदलें'
              : 'Exact pixel dimensions, 300/200 DPI JFIF density writer, and JPG/PNG/WebP conversion'}
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shrink-0">
          Working
        </span>
      </div>

      {!file ? (
        <label className="flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl hover:border-orange-500 bg-slate-50 dark:bg-slate-900/50 cursor-pointer transition-colors group">
          <Upload className="w-10 h-10 text-slate-400 group-hover:text-orange-500 transition-colors mb-3" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {language === 'hi' ? 'रीसाइज करने के लिए फोटो चुनें' : 'Choose Image to Resize / Convert'}
          </span>
          <span className="text-xs text-slate-500 mt-1">Supports JPG, PNG, WebP (Any resolution)</span>
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          <div className="md:col-span-6 space-y-4">
            
            {/* Dimensions */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Width (px)
                </label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => handleWidthChange(parseInt(e.target.value) || 100)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Height (px)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => handleHeightChange(parseInt(e.target.value) || 100)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={keepAspect}
                onChange={(e) => setKeepAspect(e.target.checked)}
                className="rounded text-orange-500 focus:ring-orange-500"
              />
              <span className="text-xs text-slate-700 dark:text-slate-300">
                {language === 'hi' ? 'पहलू अनुपात बनाए रखें (Lock Aspect Ratio)' : 'Maintain Aspect Ratio'}
              </span>
            </label>

            {/* Format & DPI */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="image/jpeg">JPG / JPEG (Standard)</option>
                  <option value="image/png">PNG (Lossless)</option>
                  <option value="image/webp">WebP (Modern Web)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  DPI Density
                </label>
                <select
                  value={dpi}
                  onChange={(e) => setDpi(Number(e.target.value))}
                  disabled={format !== 'image/jpeg'}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-50"
                >
                  <option value={300}>300 DPI (Exam / Print Standard)</option>
                  <option value={200}>200 DPI (Portal Standard)</option>
                  <option value={150}>150 DPI (Lightweight)</option>
                </select>
              </div>
            </div>

            {/* Quality Slider for JPEG / WebP */}
            {format !== 'image/png' && (
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Quality</span>
                  <span className="font-mono">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>
            )}

            <button
              type="button"
              onClick={handleProcess}
              disabled={processing}
              className="w-full py-2.5 rounded-xl bg-orange-500 text-slate-950 font-bold text-xs hover:bg-orange-400 transition-colors flex items-center justify-center gap-2 min-h-[44px]"
            >
              {processing ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
              <span>{language === 'hi' ? 'रीसाइज और कन्वर्ट करें' : 'Resize & Convert Now'}</span>
            </button>
          </div>

          {/* Preview / Result */}
          <div className="md:col-span-6 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Preview
            </span>

            <div className="max-h-56 max-w-full overflow-hidden flex items-center justify-center p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <img
                src={resultUrl || preview || ''}
                alt="Preview"
                className="max-h-48 max-w-full object-contain"
              />
            </div>

            {resultUrl && (
              <div className="mt-4 text-center space-y-2">
                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold block">
                  {width}×{height}px · {resultKb} KB · {dpi} DPI JFIF
                </span>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-5 py-2.5 rounded-xl bg-orange-500 text-slate-950 font-bold text-xs hover:bg-orange-400 transition-colors flex items-center gap-2 shadow-xs mx-auto min-h-[44px]"
                >
                  <Download className="w-4 h-4" />
                  <span>{language === 'hi' ? 'डाउनलोड करें' : 'Download Image'}</span>
                </button>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};
