import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { compressImageToTargetKb, CompressResult } from '../../utils/imageProcess.ts';
import { Upload, Download, RefreshCw, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export const ImageCompressorTool: React.FC = () => {
  const { language } = useApp();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [targetKb, setTargetKb] = useState<number>(50);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<CompressResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg(language === 'hi' ? 'कृपया केवल इमेज फाइल (JPG, PNG) चुनें।' : 'Please select an image file (JPG, PNG).');
      return;
    }

    setSelectedFile(file);
    setResult(null);
    setErrorMsg(null);
    const url = URL.createObjectURL(file);
    setOriginalPreview(url);
  };

  const runCompress = async (kbTarget: number) => {
    if (!selectedFile) return;
    setProcessing(true);
    setErrorMsg(null);

    try {
      const res = await compressImageToTargetKb(selectedFile, {
        targetKb: kbTarget,
        format: 'image/jpeg',
        dpi: 300,
      });
      setResult(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Compression failed';
      setErrorMsg(msg);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.dataUrl;
    a.download = `meraj_cafe_compressed_${result.sizeKb}kb.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {language === 'hi' ? 'इमेज कम्प्रेसर (टारगेट KB)' : 'Image Compressor (Target KB)'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'hi'
              ? 'सरकारी फॉर्म (BSSC, SSC, Police) के लिए फोटो का साइज 20KB, 50KB या 100KB बनाएं'
              : 'Reduce image file size to exact KB for online exam and government applications'}
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shrink-0">
          Working
        </span>
      </div>

      {/* File Upload Drop Area */}
      {!selectedFile ? (
        <label className="flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl hover:border-orange-500 dark:hover:border-orange-500 bg-slate-50 dark:bg-slate-900/50 cursor-pointer transition-colors group">
          <Upload className="w-10 h-10 text-slate-400 group-hover:text-orange-500 transition-colors mb-3" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {language === 'hi' ? 'फोटो चुनें या यहाँ ड्रैग करें' : 'Choose Photo or Drag & Drop'}
          </span>
          <span className="text-xs text-slate-500 mt-1">Supports JPG, PNG, WebP (Up to 15MB)</span>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
      ) : (
        <div className="space-y-6">
          
          {/* Preset Buttons & Custom KB Input */}
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              {language === 'hi' ? 'टारगेट साइज चुनें (KB)' : 'Select Target File Size (KB)'}
            </label>
            
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {[20, 50, 100, 200, 500].map((kb) => (
                <button
                  key={kb}
                  type="button"
                  onClick={() => {
                    setTargetKb(kb);
                    runCompress(kb);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors min-h-[36px] ${
                    targetKb === kb
                      ? 'bg-orange-500 text-slate-950 border-orange-500 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-orange-400'
                  }`}
                >
                  Under {kb} KB
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap">
                {language === 'hi' ? 'या कस्टम KB लिखें:' : 'Or custom target KB:'}
              </span>
              <input
                type="number"
                min="5"
                max="5000"
                value={targetKb}
                onChange={(e) => setTargetKb(Math.max(5, parseInt(e.target.value) || 20))}
                className="w-28 px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={() => runCompress(targetKb)}
                disabled={processing}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-orange-500 text-slate-950 hover:bg-orange-400 transition-colors flex items-center gap-1.5 disabled:opacity-50 min-h-[40px]"
              >
                {processing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>{language === 'hi' ? 'कम्प्रेस करें' : 'Compress Now'}</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Comparison Preview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Original Card */}
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {language === 'hi' ? 'मूल फोटो (Original)' : 'Original File'}
                </span>
                <span className="font-mono tabular-nums">
                  {Math.round(selectedFile.size / 1024)} KB
                </span>
              </div>
              {originalPreview && (
                <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center p-2">
                  <img src={originalPreview} alt="Original" className="max-h-full max-w-full object-contain" />
                </div>
              )}
            </div>

            {/* Compressed Result Card */}
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {language === 'hi' ? 'कम्प्रेस्ड परिणाम (Result)' : 'Compressed Result'}
                </span>
                {result && (
                  <span className="font-mono tabular-nums text-emerald-600 dark:text-emerald-400 font-bold">
                    {result.sizeKb} KB ({result.width}×{result.height}px)
                  </span>
                )}
              </div>

              {processing ? (
                <div className="aspect-square bg-slate-50 dark:bg-slate-800 rounded-lg flex flex-col items-center justify-center gap-2 text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin text-orange-500" />
                  <span className="text-xs">Optimizing quality & dimensions...</span>
                </div>
              ) : result ? (
                <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center p-2 relative group">
                  <img src={result.dataUrl} alt="Compressed" className="max-h-full max-w-full object-contain" />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-semibold flex items-center gap-1 shadow-sm">
                    <CheckCircle className="w-3 h-3" />
                    <span>Target Met</span>
                  </div>
                </div>
              ) : (
                <div className="aspect-square bg-slate-50 dark:bg-slate-800 rounded-lg flex flex-col items-center justify-center gap-2 text-slate-400">
                  <FileText className="w-6 h-6" />
                  <span className="text-xs text-center px-4">
                    {language === 'hi' ? 'ऊपर टारगेट KB चुनें और बटन दबाएं' : 'Select target KB above and click Compress'}
                  </span>
                </div>
              )}
            </div>

          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                setOriginalPreview(null);
                setResult(null);
              }}
              className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {language === 'hi' ? 'दूसरी फोटो बदलें' : 'Choose Different Photo'}
            </button>

            {result && (
              <button
                type="button"
                onClick={handleDownload}
                className="px-5 py-2.5 rounded-xl bg-orange-500 text-slate-950 font-bold text-xs hover:bg-orange-400 transition-colors flex items-center gap-2 shadow-sm min-h-[44px]"
              >
                <Download className="w-4 h-4" />
                <span>{language === 'hi' ? `डाउनलोड करें (${result.sizeKb} KB)` : `Download (${result.sizeKb} KB)`}</span>
              </button>
            )}
          </div>

        </div>
      )}
    </div>
  );
};
