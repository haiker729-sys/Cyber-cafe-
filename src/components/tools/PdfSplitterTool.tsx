import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { 
  getPdfPageCount, 
  parsePageRangeString, 
  splitPdfByRange, 
  splitPdfToIndividualPages 
} from '../../utils/pdfProcess.ts';
import { createBatchZip } from '../../utils/imageProcess.ts';
import { 
  Upload, 
  Download, 
  Scissors, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  HelpCircle, 
  ShieldCheck, 
  Layers, 
  Package, 
  RefreshCw, 
  Check, 
  RotateCcw 
} from 'lucide-react';

export const PdfSplitterTool: React.FC = () => {
  const { language } = useApp();

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [fileSizeKb, setFileSizeKb] = useState<number>(0);

  // Selection state
  const [rangeInput, setRangeInput] = useState<string>('1-2');
  const [selectedPages, setSelectedPages] = useState<number[]>([0, 1]); // 0-indexed
  const [selectionMode, setSelectionMode] = useState<'visual' | 'range'>('visual');
  const [outputMode, setOutputMode] = useState<'single' | 'zip'>('single');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  // Result state
  const [singleResultUrl, setSingleResultUrl] = useState<string | null>(null);
  const [zipResultBlob, setZipResultBlob] = useState<Blob | null>(null);
  const [outputStats, setOutputStats] = useState<{ pagesCount: number; sizeKb: number } | null>(null);
  const [customFileName, setCustomFileName] = useState('meraj_cafe_extracted_pages');

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage(
        language === 'hi'
          ? 'कृपया केवल वैध PDF फाइल चुनें।'
          : 'Please select a valid PDF file.'
      );
      return;
    }

    setPdfFile(f);
    setFileSizeKb(Math.round((f.size / 1024) * 10) / 10);
    setErrorMessage(null);
    setSingleResultUrl(null);
    setZipResultBlob(null);
    setOutputStats(null);

    try {
      const count = await getPdfPageCount(f);
      setTotalPages(count);
      const defaultPages = count >= 2 ? [0, 1] : [0];
      setSelectedPages(defaultPages);
      setRangeInput(count >= 2 ? '1-2' : '1');
      setCustomFileName(`${f.name.replace(/\.pdf$/i, '')}_extracted`);
    } catch {
      setTotalPages(1);
      setSelectedPages([0]);
      setRangeInput('1');
    }
  };

  // Sync range input when user types in range input
  const handleRangeInputChange = (text: string) => {
    setRangeInput(text);
    if (totalPages > 0) {
      const parsed = parsePageRangeString(text, totalPages);
      setSelectedPages(parsed);
    }
  };

  // Toggle page in visual grid
  const togglePageSelection = (pageIndex: number) => {
    setSelectedPages((prev) => {
      let updated: number[];
      if (prev.includes(pageIndex)) {
        updated = prev.filter((p) => p !== pageIndex);
      } else {
        updated = [...prev, pageIndex].sort((a, b) => a - b);
      }
      // Update range input string to match
      setRangeInput(formatIndicesToRangeStr(updated));
      return updated;
    });
    setSingleResultUrl(null);
    setZipResultBlob(null);
    setOutputStats(null);
  };

  // Convert array of indices [0, 1, 4] -> "1-2, 5"
  const formatIndicesToRangeStr = (indices: number[]): string => {
    if (indices.length === 0) return '';
    const sorted = [...indices].sort((a, b) => a - b).map((i) => i + 1);
    const ranges: string[] = [];
    let start = sorted[0];
    let end = sorted[0];

    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] === end + 1) {
        end = sorted[i];
      } else {
        ranges.push(start === end ? `${start}` : `${start}-${end}`);
        start = sorted[i];
        end = sorted[i];
      }
    }
    ranges.push(start === end ? `${start}` : `${start}-${end}`);
    return ranges.join(', ');
  };

  // Quick Selection Presets
  const selectAll = () => {
    const all = Array.from({ length: totalPages }, (_, i) => i);
    setSelectedPages(all);
    setRangeInput(`1-${totalPages}`);
  };

  const selectOdd = () => {
    const odds = Array.from({ length: totalPages }, (_, i) => i).filter((i) => (i + 1) % 2 !== 0);
    setSelectedPages(odds);
    setRangeInput(formatIndicesToRangeStr(odds));
  };

  const selectEven = () => {
    const evens = Array.from({ length: totalPages }, (_, i) => i).filter((i) => (i + 1) % 2 === 0);
    setSelectedPages(evens);
    setRangeInput(formatIndicesToRangeStr(evens));
  };

  const clearSelection = () => {
    setSelectedPages([]);
    setRangeInput('');
  };

  // Perform split extraction
  const handleExtract = async () => {
    if (!pdfFile) return;

    if (selectedPages.length === 0) {
      setErrorMessage(
        language === 'hi'
          ? 'कृपया कम से कम 1 पेज का चयन करें।'
          : 'Please select at least 1 page to extract.'
      );
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setSingleResultUrl(null);
    setZipResultBlob(null);

    try {
      if (outputMode === 'single') {
        // Mode 1: Single combined PDF with selected pages
        const rangeStr = formatIndicesToRangeStr(selectedPages);
        const res = await splitPdfByRange(pdfFile, rangeStr);
        const url = URL.createObjectURL(res.blob);
        setSingleResultUrl(url);
        setOutputStats({
          pagesCount: res.pageCount,
          sizeKb: Math.round((res.blob.size / 1024) * 10) / 10,
        });
      } else {
        // Mode 2: Separate individual PDFs in a ZIP archive
        const individualPages = await splitPdfToIndividualPages(pdfFile, selectedPages);
        const baseName = pdfFile.name.replace(/\.pdf$/i, '');
        const zipEntries = individualPages.map((item) => ({
          fileName: `${baseName}_page_${item.pageNumber}.pdf`,
          blob: item.blob,
        }));
        const zip = await createBatchZip(zipEntries);
        setZipResultBlob(zip);
        setOutputStats({
          pagesCount: individualPages.length,
          sizeKb: Math.round((zip.size / 1024) * 10) / 10,
        });
      }
    } catch (err: any) {
      setErrorMessage(
        err.message ||
          (language === 'hi'
            ? 'पेज अलग करने में त्रुटि हुई। कृपया जांचें कि PDF सुरक्षित तो नहीं है।'
            : 'Error extracting pages. Please ensure the file is not corrupted or password-protected.')
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadSingle = () => {
    if (!singleResultUrl) return;
    const cleanName = (customFileName.trim() || 'extracted_document').replace(/\.pdf$/i, '');
    const a = document.createElement('a');
    a.href = singleResultUrl;
    a.download = `${cleanName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadZip = () => {
    if (!zipResultBlob) return;
    const cleanName = (customFileName.trim() || 'extracted_pages').replace(/\.zip$/i, '');
    const url = URL.createObjectURL(zipResultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cleanName}_individual_pages.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const handleOpenPreview = () => {
    if (!singleResultUrl) return;
    window.open(singleResultUrl, '_blank');
  };

  return (
    <div className="neu-card p-4 sm:p-7 space-y-6">
      
      {/* Header with Title and Quick Guide Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/60 dark:border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl neu-icon">
              <Scissors className="w-4 h-4 text-orange-500" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {language === 'hi' ? 'PDF स्प्लिट एवं एक्सट्रैक्टर' : 'PDF Splitter & Page Extractor'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {language === 'hi'
              ? 'बड़ी PDF में से अपनी पसंद के पेज (जैसे 1-2, 5) अलग निकालें और सिंगल PDF या अलग-अलग फाइलों में डाउनलोड करें।'
              : 'Extract specific pages or page ranges from a large PDF document into a single PDF or separate files.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl neu-btn text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5 text-orange-500" />
            <span>{showGuide ? (language === 'hi' ? 'गाइड छिपाएं' : 'Hide Guide') : (language === 'hi' ? '3-स्टेप गाइड' : '3-Step Guide')}</span>
          </button>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl neu-inset-sm text-emerald-800 dark:text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>100% In-Browser Privacy</span>
          </span>
        </div>
      </div>

      {/* Collapsible 3-Step Guide */}
      {showGuide && (
        <div className="p-4 rounded-2xl neu-inset-sm space-y-3 animate-in fade-in duration-150">
          <span className="text-xs font-bold text-orange-900 dark:text-orange-300 uppercase tracking-wider block">
            {language === 'hi' ? 'PDF पेज कैसे अलग करें (3 आसान चरण):' : 'How to Extract Pages (3 Simple Steps):'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 neu-card-sm space-y-1">
              <span className="font-bold text-orange-600 dark:text-orange-400 block">1. PDF अपलोड करें</span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'hi'
                  ? 'अपनी मूल PDF फाइल चुनें जिससे पेज निकालने हैं।'
                  : 'Upload the source PDF containing multiple pages.'}
              </p>
            </div>
            <div className="p-3 neu-card-sm space-y-1">
              <span className="font-bold text-orange-600 dark:text-orange-400 block">2. पेज चुनें या रेंज लिखें</span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'hi'
                  ? 'विजुअल ग्रिड में मनपसंद पेज क्लिक करें या रेंज (उदा. 1-3, 5) दर्ज करें।'
                  : 'Click on page cards or type a range like 1-3, 5.'}
              </p>
            </div>
            <div className="p-3 neu-card-sm space-y-1">
              <span className="font-bold text-orange-600 dark:text-orange-400 block">3. एक्सट्रैक्ट व डाउनलोड</span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'hi'
                  ? 'सिंगल PDF या अलग-अलग ZIP में नए निकाले गए पेज तुरंत डाउनलोड करें।'
                  : 'Download combined extracted PDF or separate files in a ZIP archive.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Upload Zone */}
      {!pdfFile ? (
        <label className="flex flex-col items-center justify-center p-8 sm:p-12 neu-card-hover border-2 border-dashed border-orange-400/30 rounded-2xl cursor-pointer transition-all group">
          <div className="w-14 h-14 rounded-2xl neu-icon mb-3 group-hover:scale-105 transition-transform">
            <Upload className="w-7 h-7 text-orange-500" />
          </div>
          <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 text-center">
            {language === 'hi'
              ? 'स्प्लिट करने के लिए PDF फाइल चुनें या ड्रैग करें'
              : 'Choose PDF File to Split or Drag & Drop'}
          </span>
          <span className="text-xs text-slate-500 mt-1 text-center">
            Supports multi-page documents (marksheet, book, certificate bundle) · 100% In-Browser Privacy
          </span>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      ) : (
        <div className="space-y-6">
          
          {/* File Info Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 neu-inset-sm text-xs">
            <div className="flex items-center gap-3 min-w-0">
              <FileText className="w-5 h-5 text-orange-500 shrink-0" />
              <div className="min-w-0">
                <span className="font-bold text-slate-900 dark:text-white block truncate">
                  {pdfFile.name}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {totalPages} Total Pages · {fileSizeKb > 1024 ? `${Math.round((fileSizeKb / 1024) * 10) / 10} MB` : `${fileSizeKb} KB`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="cursor-pointer text-orange-600 dark:text-orange-400 font-bold hover:underline">
                <span>{language === 'hi' ? 'दूसरी फाइल बदलें' : 'Change PDF File'}</span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <span>·</span>
              <button
                type="button"
                onClick={() => {
                  setPdfFile(null);
                  setSingleResultUrl(null);
                  setZipResultBlob(null);
                  setOutputStats(null);
                }}
                className="text-red-500 hover:underline font-semibold"
              >
                {language === 'hi' ? 'हटाएं' : 'Remove'}
              </button>
            </div>
          </div>

          {/* Controls: Mode Selectors & Quick Selection Presets */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Extraction Options (5 cols) */}
            <div className="md:col-span-5 space-y-4">
              
              {/* Output Format Mode: Single Combined PDF vs Separate ZIP */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {language === 'hi' ? 'आउटपुट मोड चुनें:' : 'Extraction Output Mode:'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOutputMode('single')}
                    className={`p-3 rounded-xl text-left transition-all ${
                      outputMode === 'single'
                        ? 'neu-btn-orange shadow-md'
                        : 'neu-btn text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <Layers className="w-4 h-4 mb-1.5" />
                    <span className="block font-bold text-xs">
                      {language === 'hi' ? 'सिंगल PDF' : 'Single PDF'}
                    </span>
                    <span className="block text-[10px] opacity-80">
                      {language === 'hi' ? 'सभी चुने गए पेज 1 फाइल में' : 'All selected pages in 1 document'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOutputMode('zip')}
                    className={`p-3 rounded-xl text-left transition-all ${
                      outputMode === 'zip'
                        ? 'neu-btn-orange shadow-md'
                        : 'neu-btn text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <Package className="w-4 h-4 mb-1.5" />
                    <span className="block font-bold text-xs">
                      {language === 'hi' ? 'अलग-अलग (ZIP)' : 'Separate (ZIP)'}
                    </span>
                    <span className="block text-[10px] opacity-80">
                      {language === 'hi' ? 'हर पेज की अलग फाइल' : 'Each page as separate file in ZIP'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Range input string */}
              <div className="p-4 rounded-2xl neu-inset-sm space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      {language === 'hi' ? 'पेज रेंज (Page Range):' : 'Enter Page Range:'}
                    </label>
                    <span className="text-[11px] font-mono text-orange-600 dark:text-orange-400 font-bold">
                      {selectedPages.length} of {totalPages} selected
                    </span>
                  </div>
                  <input
                    type="text"
                    value={rangeInput}
                    onChange={(e) => handleRangeInputChange(e.target.value)}
                    placeholder="e.g. 1-3, 5, 8-10"
                    className="w-full px-3 py-2 text-sm neu-input font-mono"
                  />
                  <span className="text-[11px] text-slate-500 block mt-1.5">
                    {language === 'hi'
                      ? 'उदाहरण: 1-3 (पेज 1 से 3) या 1, 4, 7'
                      : 'Examples: 1-3 (pages 1 to 3), or 1, 4, 7'}
                  </span>
                </div>

                {/* Quick Selection Buttons */}
                <div className="space-y-1.5 pt-2 border-t border-white/40 dark:border-white/5">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block uppercase">
                    Quick Select:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={selectAll}
                      className="px-3 py-1.5 rounded-xl neu-btn text-[11px] font-semibold text-slate-700 dark:text-slate-300"
                    >
                      All ({totalPages})
                    </button>
                    <button
                      type="button"
                      onClick={selectOdd}
                      className="px-3 py-1.5 rounded-xl neu-btn text-[11px] font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Odd Pages
                    </button>
                    <button
                      type="button"
                      onClick={selectEven}
                      className="px-3 py-1.5 rounded-xl neu-btn text-[11px] font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Even Pages
                    </button>
                    <button
                      type="button"
                      onClick={clearSelection}
                      className="px-2.5 py-1 text-[11px] font-semibold text-red-500 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              {/* Extract CTA Button */}
              <button
                type="button"
                onClick={handleExtract}
                disabled={isProcessing || selectedPages.length === 0}
                className="w-full py-3 neu-btn-orange text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px]"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{language === 'hi' ? 'पेज निकाले जा रहे हैं...' : 'Extracting Pages...'}</span>
                  </>
                ) : (
                  <>
                    <Scissors className="w-4 h-4" />
                    <span>
                      {language === 'hi'
                        ? `${selectedPages.length} पेज अलग निकालें (Extract)`
                        : `Extract ${selectedPages.length} Pages Now`}
                    </span>
                  </>
                )}
              </button>

            </div>

            {/* Right Column: Visual Page Grid (7 cols) */}
            <div className="md:col-span-7 neu-card p-4 sm:p-5 space-y-4">
              
              <div className="flex items-center justify-between pb-2 border-b border-white/60 dark:border-white/5 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {language === 'hi' ? 'विजुअल पेज चयन (क्लिक करके चुनें):' : 'Interactive Page Selector (Click to toggle):'}
                </span>
                <span className="font-mono text-slate-500 text-[11px]">
                  {selectedPages.length} pages selected
                </span>
              </div>

              {/* Grid of interactive page badges */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 max-h-80 overflow-y-auto pr-1">
                {Array.from({ length: totalPages }, (_, i) => {
                  const isSelected = selectedPages.includes(i);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => togglePageSelection(i)}
                      className={`p-3 rounded-xl text-center transition-all flex flex-col items-center justify-center gap-1 min-h-[72px] relative ${
                        isSelected
                          ? 'neu-btn-orange shadow-md scale-102 font-bold'
                          : 'neu-btn text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-slate-950 text-white flex items-center justify-center text-[9px]">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                      <FileText className={`w-4 h-4 ${isSelected ? 'text-slate-950' : 'text-slate-400'}`} />
                      <span className="text-xs font-mono">
                        Page {i + 1}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Result Area */}
              {(singleResultUrl || zipResultBlob) && outputStats && (
                <div className="p-4 sm:p-5 rounded-2xl neu-card space-y-3 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg neu-icon shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                        {language === 'hi' ? 'पेज सफलतापूर्वक अलग हो गए!' : 'Pages Successfully Extracted!'}
                      </h4>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                        {outputStats.pagesCount} Pages · {outputStats.sizeKb > 1024 ? `${Math.round((outputStats.sizeKb / 1024) * 10) / 10} MB` : `${outputStats.sizeKb} KB`} · Ready for instant download
                      </span>
                    </div>
                  </div>

                  {/* Custom Filename */}
                  <div className="flex items-center gap-2 pt-1 text-xs">
                    <span className="text-slate-600 dark:text-slate-400 font-semibold shrink-0">Filename:</span>
                    <input
                      type="text"
                      value={customFileName}
                      onChange={(e) => setCustomFileName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs neu-input font-mono"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {singleResultUrl && (
                      <>
                        <button
                          type="button"
                          onClick={handleOpenPreview}
                          className="px-3.5 py-2 rounded-xl neu-btn text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 min-h-[40px]"
                        >
                          <Eye className="w-3.5 h-3.5 text-orange-500" />
                          <span>Preview</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleDownloadSingle}
                          className="flex-1 px-5 py-2 rounded-xl neu-btn-emerald text-white font-bold text-xs flex items-center justify-center gap-2 min-h-[40px]"
                        >
                          <Download className="w-4 h-4" />
                          <span>{language === 'hi' ? 'निकाली गई PDF डाउनलोड करें' : 'Download Extracted PDF'}</span>
                        </button>
                      </>
                    )}

                    {zipResultBlob && (
                      <button
                        type="button"
                        onClick={handleDownloadZip}
                        className="w-full px-5 py-2.5 rounded-xl neu-btn-emerald text-white font-bold text-xs flex items-center justify-center gap-2 min-h-[40px]"
                      >
                        <Package className="w-4 h-4" />
                        <span>{language === 'hi' ? 'सभी अलग पेज ZIP डाउनलोड करें' : 'Download Separate Pages ZIP'}</span>
                      </button>
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
