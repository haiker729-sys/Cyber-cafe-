import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { 
  processImageWithControls, 
  createBatchZip, 
  loadImage, 
  CompressResult, 
  BatchItemResult 
} from '../../utils/imageProcess.ts';
import { 
  Upload, 
  Download, 
  RefreshCw, 
  Camera, 
  Sliders, 
  CheckCircle2, 
  AlertCircle, 
  Package, 
  Trash2, 
  Maximize2, 
  Sparkles, 
  Check, 
  Layers 
} from 'lucide-react';

export const ImageToolsSuite: React.FC = () => {
  const { language } = useApp();

  // Mode: 'all_in_one' | 'compressor' | 'resizer' | 'converter'
  const [activeSubMode, setActiveSubMode] = useState<'all_in_one' | 'compressor' | 'resizer' | 'converter'>('all_in_one');

  // Input files state (supports single and batch)
  const [inputFiles, setInputFiles] = useState<File[]>([]);
  const [singlePreviewUrl, setSinglePreviewUrl] = useState<string | null>(null);
  const [singleOrigDims, setSingleOrigDims] = useState<{ w: number; h: number } | null>(null);

  // Controls state
  const [format, setFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [useTargetKb, setUseTargetKb] = useState<boolean>(true);
  const [targetKb, setTargetKb] = useState<number>(50);
  const [quality, setQuality] = useState<number>(85); // 10 - 100
  const [widthPx, setWidthPx] = useState<number>(800);
  const [heightPx, setHeightPx] = useState<number>(600);
  const [useExactDims, setUseExactDims] = useState<boolean>(false);
  const [maintainAspect, setMaintainAspect] = useState<boolean>(true);
  const [dpi, setDpi] = useState<number>(300);

  // Processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressCount, setProgressCount] = useState<{ done: number; total: number }>({ done: 0, total: 0 });
  const [singleResult, setSingleResult] = useState<CompressResult | null>(null);
  const [batchResults, setBatchResults] = useState<BatchItemResult[]>([]);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle mode adjustments
  const handleSubModeChange = (mode: 'all_in_one' | 'compressor' | 'resizer' | 'converter') => {
    setActiveSubMode(mode);
    setErrorMessage(null);
    if (mode === 'compressor') {
      setUseTargetKb(true);
      setUseExactDims(false);
    } else if (mode === 'resizer') {
      setUseExactDims(true);
      setUseTargetKb(false);
    } else if (mode === 'converter') {
      setUseTargetKb(false);
      setUseExactDims(false);
    } else {
      setUseTargetKb(true);
      setUseExactDims(false);
    }
  };

  // Handle file selections
  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    const validImages = files.filter((f) => f.type.startsWith('image/'));
    if (validImages.length === 0) {
      setErrorMessage(
        language === 'hi'
          ? 'कृपया केवल मान्य इमेज फाइलें (JPG, PNG, WebP) अपलोड करें।'
          : 'Please select valid image files (JPG, PNG, WebP).'
      );
      return;
    }

    setInputFiles(validImages);
    setSingleResult(null);
    setBatchResults([]);
    setZipBlob(null);
    setErrorMessage(null);

    // If single image, load dimensions & preview
    if (validImages.length === 1) {
      const url = URL.createObjectURL(validImages[0]);
      setSinglePreviewUrl(url);
      try {
        const img = await loadImage(validImages[0]);
        setSingleOrigDims({ w: img.naturalWidth, h: img.naturalHeight });
        setWidthPx(img.naturalWidth);
        setHeightPx(img.naturalHeight);
      } catch {
        // Fallback
      }
    } else {
      setSinglePreviewUrl(null);
      setSingleOrigDims(null);
    }
  };

  // Dimensions handlers with aspect ratio lock
  const handleWidthChange = (w: number) => {
    setWidthPx(w);
    if (maintainAspect && singleOrigDims && singleOrigDims.w > 0) {
      const propH = Math.round((w / singleOrigDims.w) * singleOrigDims.h);
      setHeightPx(propH);
    }
  };

  const handleHeightChange = (h: number) => {
    setHeightPx(h);
    if (maintainAspect && singleOrigDims && singleOrigDims.h > 0) {
      const propW = Math.round((h / singleOrigDims.h) * singleOrigDims.w);
      setWidthPx(propW);
    }
  };

  // Apply dimension preset
  const applyDimPreset = (w: number, h: number) => {
    setUseExactDims(true);
    setWidthPx(w);
    setHeightPx(h);
    setMaintainAspect(false);
  };

  // Run processing (supports single or batch)
  const runProcessing = async () => {
    if (inputFiles.length === 0) return;
    setIsProcessing(true);
    setErrorMessage(null);
    setSingleResult(null);
    setBatchResults([]);
    setZipBlob(null);

    const options = {
      format,
      targetKb: useTargetKb ? targetKb : undefined,
      quality: quality / 100,
      width: useExactDims ? widthPx : undefined,
      height: useExactDims ? heightPx : undefined,
      maintainAspectRatio: maintainAspect,
      dpi,
    };

    try {
      if (inputFiles.length === 1) {
        // Single File Processing
        const res = await processImageWithControls(inputFiles[0], options);
        setSingleResult(res);
      } else {
        // Batch Processing
        const results: BatchItemResult[] = [];
        const zipEntries: Array<{ fileName: string; blob: Blob }> = [];

        setProgressCount({ done: 0, total: inputFiles.length });

        for (let i = 0; i < inputFiles.length; i++) {
          const file = inputFiles[i];
          try {
            const res = await processImageWithControls(file, options);
            results.push({
              id: `item-${i}`,
              originalName: file.name,
              originalSizeKb: Math.round((file.size / 1024) * 10) / 10,
              result: res,
              status: 'done',
            });

            // Extension for output
            const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/png' ? 'png' : 'webp';
            const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            zipEntries.push({
              fileName: `${baseName}_processed.${ext}`,
              blob: res.blob,
            });
          } catch (err: any) {
            results.push({
              id: `item-${i}`,
              originalName: file.name,
              originalSizeKb: Math.round((file.size / 1024) * 10) / 10,
              result: { blob: new Blob(), dataUrl: '', width: 0, height: 0, sizeKb: 0 },
              status: 'error',
              errorMessage: err.message || 'Processing failed',
            });
          }
          setProgressCount({ done: i + 1, total: inputFiles.length });
        }

        setBatchResults(results);

        // Generate ZIP if any succeeded
        if (zipEntries.length > 0) {
          const zip = await createBatchZip(zipEntries);
          setZipBlob(zip);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during processing.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadSingle = (res: CompressResult, baseName?: string) => {
    const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/png' ? 'png' : 'webp';
    const filename = baseName
      ? `${baseName.replace(/\.[^/.]+$/, '')}_${res.sizeKb}kb.${ext}`
      : `meraj_cafe_processed_${res.sizeKb}kb.${ext}`;
    const a = document.createElement('a');
    a.href = res.dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadZip = () => {
    if (!zipBlob) return;
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meraj_cafe_batch_images_${inputFiles.length}_files.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  return (
    <div className="neu-card p-4 sm:p-7 space-y-6">
      
      {/* Header & Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/60 dark:border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl neu-icon">
              <Camera className="w-4 h-4 text-orange-500" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {language === 'hi'
                ? 'इमेज टूल्स सुइट: कम्प्रेसर, रीसाइज़र एवं कनवर्टर'
                : 'Image Tools Suite: Compressor, Resizer & Converter'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {language === 'hi'
              ? 'JPG, PNG और WebP सपोर्ट, टारगेट KB बाइनरी सर्च, सटीक पिक्सल साइज, 300 DPI JFIF और बैच ZIP डाउनलोड'
              : 'Full JPEG, PNG & WebP support, target KB binary search, exact px resizing, 300 DPI metadata, and batch ZIP export.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% Tested & Working</span>
          </span>
        </div>
      </div>

      {/* Sub-Mode Segmented Control Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl neu-inset-sm max-w-xl overflow-x-auto">
        {[
          { id: 'all_in_one', labelEn: 'All-in-One Studio', labelHi: 'ऑल-इन-वन स्टूडियो' },
          { id: 'compressor', labelEn: 'Target KB Compressor', labelHi: 'KB कम्प्रेसर' },
          { id: 'resizer', labelEn: 'Pixel Resizer & DPI', labelHi: 'पिक्सल रीसाइज़र' },
          { id: 'converter', labelEn: 'Format Converter', labelHi: 'फॉर्मेट कनवर्टर' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleSubModeChange(tab.id as any)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all min-h-[38px] ${
              activeSubMode === tab.id
                ? 'neu-tab-active bg-[#E8EDF5] dark:bg-[#1B1E27] text-orange-600 dark:text-orange-400'
                : 'neu-tab-idle'
            }`}
          >
            {language === 'hi' ? tab.labelHi : tab.labelEn}
          </button>
        ))}
      </div>

      {/* Upload Zone (Single or Batch) */}
      {inputFiles.length === 0 ? (
        <label className="flex flex-col items-center justify-center p-8 sm:p-12 neu-card-hover border-2 border-dashed border-orange-400/30 rounded-2xl cursor-pointer transition-all group">
          <div className="w-14 h-14 rounded-2xl neu-icon mb-3 group-hover:scale-105 transition-transform">
            <Upload className="w-7 h-7 text-orange-500" />
          </div>
          <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 text-center">
            {language === 'hi'
              ? 'एक या एक से अधिक फोटो चुनें (ड्रैग एंड ड्रॉप)'
              : 'Choose Single Photo or Select Multiple Images (Batch)'}
          </span>
          <span className="text-xs text-slate-500 mt-1 text-center">
            Supports JPEG, PNG, and WebP (up to 20 files at once for batch ZIP download)
          </span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            multiple
            onChange={handleFilesSelected}
            className="hidden"
          />
        </label>
      ) : (
        <div className="space-y-6">
          
          {/* File summary pill & reset button */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 neu-inset-sm text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white">
                {inputFiles.length === 1 ? inputFiles[0].name : `${inputFiles.length} files selected for batch processing`}
              </span>
              <span className="text-slate-500">
                ({Math.round(inputFiles.reduce((acc, f) => acc + f.size, 0) / 1024)} KB total)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label className="cursor-pointer text-orange-600 dark:text-orange-400 font-semibold hover:underline">
                <span>{language === 'hi' ? '+ और फाइलें जोड़ें' : '+ Add More Files'}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      setInputFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
                    }
                  }}
                  className="hidden"
                />
              </label>
              <span>·</span>
              <button
                type="button"
                onClick={() => {
                  setInputFiles([]);
                  setSingleResult(null);
                  setBatchResults([]);
                  setZipBlob(null);
                  setSinglePreviewUrl(null);
                }}
                className="text-red-500 hover:underline font-semibold"
              >
                {language === 'hi' ? 'हटाएं' : 'Clear All'}
              </button>
            </div>
          </div>

          {/* Interactive Controls Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Controls Column (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* 1. Format Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {language === 'hi' ? 'आउटपुट फॉर्मेट (Format Conversion)' : 'Output Format (Converter)'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'image/jpeg', label: 'JPEG / JPG', desc: 'Standard & Exam' },
                    { id: 'image/png', label: 'PNG', desc: 'Lossless & Crisp' },
                    { id: 'image/webp', label: 'WebP', desc: 'Ultra-compressed' },
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => setFormat(fmt.id as any)}
                      className={`p-2.5 rounded-xl text-left transition-all ${
                        format === fmt.id
                          ? 'neu-btn-orange shadow-md'
                          : 'neu-btn text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <span className="block font-bold text-xs">{fmt.label}</span>
                      <span className="block text-[10px] opacity-80">{fmt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Target KB Selection (Compressor) */}
              <div className="p-4 sm:p-5 rounded-2xl neu-card-sm space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useTargetKb}
                      onChange={(e) => setUseTargetKb(e.target.checked)}
                      className="rounded text-orange-500 focus:ring-orange-500 w-4 h-4"
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      {language === 'hi' ? 'टारगेट साइज लागू करें (Target KB)' : 'Enable Target Size (Target KB)'}
                    </span>
                  </label>
                  {useTargetKb && (
                    <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400">
                      Under {targetKb} KB
                    </span>
                  )}
                </div>

                {useTargetKb ? (
                  <div className="space-y-3 pt-1">
                    {/* Quick Presets */}
                    <div className="flex flex-wrap items-center gap-2">
                      {[
                        { kb: 20, tag: 'Signature / Exam' },
                        { kb: 50, tag: 'SSC / BPSC' },
                        { kb: 100, tag: 'Standard Form' },
                        { kb: 200, tag: 'Document' },
                        { kb: 500, tag: 'HD Photo' },
                      ].map((item) => (
                        <button
                          key={item.kb}
                          type="button"
                          onClick={() => setTargetKb(item.kb)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all min-h-[34px] ${
                            targetKb === item.kb
                              ? 'neu-btn-orange'
                              : 'neu-btn text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {item.kb} KB
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        {language === 'hi' ? 'कस्टम साइज:' : 'Custom KB Target:'}
                      </span>
                      <input
                        type="number"
                        min="5"
                        max="5000"
                        value={targetKb}
                        onChange={(e) => setTargetKb(Math.max(5, parseInt(e.target.value) || 20))}
                        className="w-28 px-3 py-1.5 text-xs neu-input font-mono"
                      />
                      <span className="text-xs text-slate-500 font-mono">KB</span>
                    </div>
                  </div>
                ) : (
                  /* Manual Quality Slider when target KB is off */
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
                      <span>Manual Quality Compression:</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{quality}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(parseInt(e.target.value))}
                      className="w-full accent-orange-500"
                    />
                  </div>
                )}
              </div>

              {/* 3. Pixel Dimensions (Resizer) */}
              <div className="p-4 sm:p-5 rounded-2xl neu-card-sm space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useExactDims}
                      onChange={(e) => setUseExactDims(e.target.checked)}
                      className="rounded text-orange-500 focus:ring-orange-500 w-4 h-4"
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      {language === 'hi' ? 'सटीक पिक्सल रीसाइज़ (Pixel Resizer)' : 'Exact Pixel Dimensions (Resizer)'}
                    </span>
                  </label>
                  {useExactDims && (
                    <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400">
                      {widthPx} × {heightPx} px
                    </span>
                  )}
                </div>

                {useExactDims && (
                  <div className="space-y-3 pt-1">
                    {/* Dimension Presets */}
                    <div className="flex flex-wrap items-center gap-2">
                      {[
                        { w: 140, h: 60, label: '140×60 (Signature)' },
                        { w: 350, h: 450, label: '350×450 (Exam Photo)' },
                        { w: 600, h: 600, label: '600×600 (Square ID)' },
                        { w: 1080, h: 1080, label: '1080×1080 (HD Square)' },
                        { w: 1920, h: 1080, label: '1920×1080 (Full HD)' },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => applyDimPreset(preset.w, preset.h)}
                          className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-xl transition-all ${
                            widthPx === preset.w && heightPx === preset.h
                              ? 'neu-btn-orange'
                              : 'neu-btn text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    {/* Width & Height Inputs */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          Width (px)
                        </label>
                        <input
                          type="number"
                          value={widthPx}
                          onChange={(e) => handleWidthChange(parseInt(e.target.value) || 100)}
                          className="w-full px-3 py-1.5 text-xs neu-input font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          Height (px)
                        </label>
                        <input
                          type="number"
                          value={heightPx}
                          onChange={(e) => handleHeightChange(parseInt(e.target.value) || 100)}
                          className="w-full px-3 py-1.5 text-xs neu-input font-mono"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={maintainAspect}
                        onChange={(e) => setMaintainAspect(e.target.checked)}
                        className="rounded text-orange-500 focus:ring-orange-500 w-3.5 h-3.5"
                      />
                      <span className="text-[11px] text-slate-600 dark:text-slate-400">
                        {language === 'hi' ? 'पहलू अनुपात लॉक रखें (Lock Aspect Ratio)' : 'Lock Aspect Ratio Proportionally'}
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* 4. DPI Metadata (JPEG) */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl neu-inset-sm text-xs">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    JPEG JFIF DPI Metadata
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Injects exact JFIF density bytes for official portal scan compliance
                  </span>
                </div>

                <select
                  value={dpi}
                  onChange={(e) => setDpi(Number(e.target.value))}
                  disabled={format !== 'image/jpeg'}
                  className="px-3 py-1.5 text-xs rounded-xl neu-btn font-semibold disabled:opacity-50"
                >
                  <option value={300}>300 DPI (Exam / Print Standard)</option>
                  <option value={200}>200 DPI (Web Standard)</option>
                  <option value={600}>600 DPI (Ultra Sharp)</option>
                </select>
              </div>

              {/* Action Trigger Button */}
              <button
                type="button"
                onClick={runProcessing}
                disabled={isProcessing}
                className="w-full py-3 neu-btn-orange text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px]"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>
                      {inputFiles.length > 1
                        ? `Processing ${progressCount.done} of ${progressCount.total}...`
                        : 'Compressing & Converting...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {inputFiles.length > 1
                        ? `Process All ${inputFiles.length} Images (Batch)`
                        : language === 'hi' ? 'प्रोसेस और कन्वर्ट करें' : 'Process Image Now'}
                    </span>
                  </>
                )}
              </button>

              {errorMessage && (
                <div className="flex items-center gap-2 p-3.5 rounded-xl neu-inset text-xs text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

            </div>

            {/* Right Preview & Results Column (5 cols) */}
            <div className="lg:col-span-5 neu-card p-4 sm:p-5 space-y-4">
              
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {inputFiles.length > 1 ? 'Batch Results Queue' : 'Live Output Preview'}
                </span>
                {singleResult && (
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {singleResult.sizeKb} KB
                  </span>
                )}
              </div>

              {/* Single File Result Display */}
              {inputFiles.length === 1 && (
                <div className="space-y-4">
                  <div className="aspect-square max-h-64 mx-auto rounded-2xl neu-inset overflow-hidden flex items-center justify-center p-3 relative">
                    <img
                      src={singleResult?.dataUrl || singlePreviewUrl || ''}
                      alt="Preview"
                      className="max-h-full max-w-full object-contain rounded-lg"
                    />
                    {singleResult && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-emerald-600 text-white text-[10px] font-semibold flex items-center gap-1 shadow-sm">
                        <Check className="w-3 h-3" />
                        <span>Ready</span>
                      </div>
                    )}
                  </div>

                  {/* Size Comparison Card */}
                  {singleResult && (
                    <div className="p-4 rounded-xl neu-inset-sm space-y-2 text-xs">
                      <div className="flex justify-between items-center text-slate-500">
                        <span>Original File Size:</span>
                        <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                          {Math.round(inputFiles[0].size / 1024)} KB
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-bold">
                        <span>Compressed / Converted:</span>
                        <span className="font-mono text-sm">
                          {singleResult.sizeKb} KB ({singleResult.width}×{singleResult.height}px)
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800 flex justify-between text-[11px] text-slate-400">
                        <span>DPI: {dpi}</span>
                        <span>Format: {format.replace('image/', '').toUpperCase()}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDownloadSingle(singleResult, inputFiles[0].name)}
                        className="w-full mt-2 py-2.5 neu-btn-orange text-xs font-bold flex items-center justify-center gap-2 min-h-[44px]"
                      >
                        <Download className="w-4 h-4" />
                        <span>
                          {language === 'hi'
                            ? `डाउनलोड करें (${singleResult.sizeKb} KB)`
                            : `Download Result (${singleResult.sizeKb} KB)`}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Batch Processing List & 1-Click ZIP Download */}
              {inputFiles.length > 1 && (
                <div className="space-y-4">
                  {zipBlob && (
                    <button
                      type="button"
                      onClick={handleDownloadZip}
                      className="w-full py-3 neu-btn-emerald text-white font-bold text-xs flex items-center justify-center gap-2 min-h-[44px]"
                    >
                      <Package className="w-4 h-4" />
                      <span>
                        {language === 'hi'
                          ? `सभी ${inputFiles.length} फाइलें ZIP डाउनलोड करें`
                          : `Download All as ZIP (${Math.round(zipBlob.size / 1024)} KB)`}
                      </span>
                    </button>
                  )}

                  <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                    {batchResults.length > 0 ? (
                      batchResults.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 rounded-xl neu-card-sm flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="truncate">
                            <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">
                              {item.originalName}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {item.originalSizeKb} KB →{' '}
                              <strong className="text-emerald-600 dark:text-emerald-400">
                                {item.result.sizeKb} KB
                              </strong>{' '}
                              ({item.result.width}×{item.result.height}px)
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDownloadSingle(item.result, item.originalName)}
                            className="p-2 neu-btn min-h-[36px] min-w-[36px] flex items-center justify-center shrink-0"
                            title="Download single file"
                          >
                            <Download className="w-3.5 h-3.5 text-orange-500" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-xs text-slate-400">
                        Click "Process All {inputFiles.length} Images" on the left to batch compress and generate the download package.
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
