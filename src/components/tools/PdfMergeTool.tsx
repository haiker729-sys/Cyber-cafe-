import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { 
  mergePdfFilesWithMetadata, 
  getPdfPageCount 
} from '../../utils/pdfProcess.ts';
import { 
  Upload, 
  Download, 
  Files, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  FileText, 
  HelpCircle, 
  ShieldCheck, 
  Plus 
} from 'lucide-react';

interface PdfFileItem {
  id: string;
  file: File;
  name: string;
  sizeKb: number;
  pageCount: number;
}

export const PdfMergeTool: React.FC = () => {
  const { language } = useApp();

  const [pdfItems, setPdfItems] = useState<PdfFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Result state
  const [mergedBlobUrl, setMergedBlobUrl] = useState<string | null>(null);
  const [mergedStats, setMergedStats] = useState<{ totalPages: number; sizeKb: number; fileCount: number } | null>(null);
  const [customFileName, setCustomFileName] = useState('meraj_cafe_merged_document');
  const [showGuide, setShowGuide] = useState(false);

  // Handle file additions
  const handleAddFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFiles = e.target.files ? Array.from(e.target.files) : [];
    if (rawFiles.length === 0) return;

    setErrorMessage(null);
    setMergedBlobUrl(null);
    setMergedStats(null);

    const pdfOnly = rawFiles.filter(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );

    if (pdfOnly.length === 0) {
      setErrorMessage(
        language === 'hi'
          ? 'कृपया केवल वैध PDF फाइलें चुनें।'
          : 'Please select valid PDF documents only.'
      );
      return;
    }

    // Read page counts in parallel
    const newItems: PdfFileItem[] = [];
    for (let i = 0; i < pdfOnly.length; i++) {
      const f = pdfOnly[i];
      let pCount = 1;
      try {
        pCount = await getPdfPageCount(f);
      } catch {
        pCount = 1;
      }

      newItems.push({
        id: `pdf-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
        file: f,
        name: f.name,
        sizeKb: Math.round((f.size / 1024) * 10) / 10,
        pageCount: pCount,
      });
    }

    setPdfItems((prev) => [...prev, ...newItems]);
  };

  // Reordering helpers
  const moveItem = (index: number, direction: 'up' | 'down') => {
    setPdfItems((prev) => {
      const copy = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= copy.length) return copy;
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
    setMergedBlobUrl(null);
    setMergedStats(null);
  };

  const removeItem = (index: number) => {
    setPdfItems((prev) => prev.filter((_, i) => i !== index));
    setMergedBlobUrl(null);
    setMergedStats(null);
  };

  const clearAll = () => {
    setPdfItems([]);
    setMergedBlobUrl(null);
    setMergedStats(null);
    setErrorMessage(null);
  };

  // Run the merge using pdf-lib
  const handleMerge = async () => {
    if (pdfItems.length < 2) {
      setErrorMessage(
        language === 'hi'
          ? 'कम से कम 2 PDF फाइलें जोड़ना आवश्यक है।'
          : 'Please add at least 2 PDF files to merge.'
      );
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const filesToMerge = pdfItems.map((item) => item.file);
      const res = await mergePdfFilesWithMetadata(filesToMerge);
      const url = URL.createObjectURL(res.blob);
      setMergedBlobUrl(url);
      setMergedStats({
        totalPages: res.totalPages,
        sizeKb: res.sizeKb,
        fileCount: filesToMerge.length,
      });
    } catch (err: any) {
      setErrorMessage(
        err.message ||
          (language === 'hi'
            ? 'PDF मर्ज करने में त्रुटि हुई। कृपया जांचें कि कोई फाइल पासवर्ड-सुरक्षित तो नहीं है।'
            : 'Error merging PDFs. Please check if any file is encrypted or damaged.')
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!mergedBlobUrl) return;
    const cleanName = (customFileName.trim() || 'meraj_cafe_merged_document').replace(/\.pdf$/i, '');
    const a = document.createElement('a');
    a.href = mergedBlobUrl;
    a.download = `${cleanName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleOpenPreview = () => {
    if (!mergedBlobUrl) return;
    window.open(mergedBlobUrl, '_blank');
  };

  const totalPagesInQueue = pdfItems.reduce((acc, curr) => acc + curr.pageCount, 0);
  const totalSizeKbInQueue = Math.round(pdfItems.reduce((acc, curr) => acc + curr.sizeKb, 0) * 10) / 10;

  return (
    <div className="neu-card p-4 sm:p-7 space-y-6">
      
      {/* Header with Title and Quick Guide Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/60 dark:border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl neu-icon">
              <Files className="w-4 h-4 text-orange-500" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {language === 'hi' ? 'PDF मर्ज (फाइलें जोड़ें)' : 'PDF Merge Tool'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {language === 'hi'
              ? 'मार्कशीट, आधार, पैन और प्रमाण पत्रों की कई PDF फाइलों को क्रमबद्ध करके एक सिंगल PDF में जोड़ें।'
              : 'Combine multiple PDF certificates, marksheet, and identity files into one single PDF document.'}
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

      {/* Quick 3-Step Guide Collapsible Panel */}
      {showGuide && (
        <div className="p-4 rounded-2xl neu-inset-sm space-y-3 animate-in fade-in duration-150">
          <span className="text-xs font-bold text-orange-900 dark:text-orange-300 uppercase tracking-wider block">
            {language === 'hi' ? 'PDF मर्ज कैसे करें (3 आसान चरण):' : 'How to Merge PDFs (3 Simple Steps):'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 neu-card-sm space-y-1">
              <span className="font-bold text-orange-600 dark:text-orange-400 block">1. PDF जोड़ें</span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'hi'
                  ? 'अपनी सभी PDF फाइलें ड्रैग करें या फाइल सेलेक्ट करके जोड़ें।'
                  : 'Upload all PDF certificates or documents you want to combine.'}
              </p>
            </div>
            <div className="p-3 neu-card-sm space-y-1">
              <span className="font-bold text-orange-600 dark:text-orange-400 block">2. क्रम व्यवस्थित करें</span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'hi'
                  ? 'ऊपर/नीचे तीरों (↑ / ↓) से जिस फाइल को पहले रखना है उसे ऊपर लाएं।'
                  : 'Use up and down arrows to set the exact page sequence.'}
              </p>
            </div>
            <div className="p-3 neu-card-sm space-y-1">
              <span className="font-bold text-orange-600 dark:text-orange-400 block">3. कंबाइन व डाउनलोड</span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'hi'
                  ? 'मर्ज बटन दबाएं और तैयार सिंगल PDF फाइल तुरंत डाउनलोड करें।'
                  : 'Click Merge and instantly download your clean combined PDF.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Upload Zone */}
      {pdfItems.length === 0 ? (
        <label className="flex flex-col items-center justify-center p-8 sm:p-12 neu-card-hover border-2 border-dashed border-orange-400/30 rounded-2xl cursor-pointer transition-all group">
          <div className="w-14 h-14 rounded-2xl neu-icon mb-3 group-hover:scale-105 transition-transform">
            <Upload className="w-7 h-7 text-orange-500" />
          </div>
          <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 text-center">
            {language === 'hi'
              ? 'मर्ज करने के लिए PDF फाइलें चुनें (एक साथ कई फाइलें चुन सकते हैं)'
              : 'Choose Multiple PDF Files to Merge (Drag & Drop)'}
          </span>
          <span className="text-xs text-slate-500 mt-1 text-center">
            Supports standard PDF files · 100% Client-Side In-Browser Processing
          </span>
          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleAddFiles}
            className="hidden"
          />
        </label>
      ) : (
        <div className="space-y-6">
          
          {/* Queue Header Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 neu-inset-sm text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-900 dark:text-white">
                {pdfItems.length} PDF Files in Queue
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500">
                {totalPagesInQueue} Total Pages
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500">
                {totalSizeKbInQueue > 1024
                  ? `${Math.round((totalSizeKbInQueue / 1024) * 10) / 10} MB`
                  : `${totalSizeKbInQueue} KB`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl neu-btn text-orange-600 dark:text-orange-400 font-bold transition-all">
                <Plus className="w-3.5 h-3.5 text-orange-500" />
                <span>{language === 'hi' ? '+ और PDF जोड़ें' : '+ Add More PDFs'}</span>
                <input
                  type="file"
                  accept="application/pdf"
                  multiple
                  onChange={handleAddFiles}
                  className="hidden"
                />
              </label>
              <span>·</span>
              <button
                type="button"
                onClick={clearAll}
                className="text-red-500 hover:underline font-semibold"
              >
                {language === 'hi' ? 'सभी हटाएं' : 'Clear All'}
              </button>
            </div>
          </div>

          {/* Interactive Reorder List */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              {language === 'hi' ? 'दस्तावेजों का क्रम (तीरों द्वारा ऊपर/नीचे करें):' : 'Document Sequence (Reorder with arrows):'}
            </span>

            <div className="space-y-2">
              {pdfItems.map((item, index) => (
                <div
                  key={item.id}
                  className="p-3 sm:p-4 rounded-xl neu-card-sm flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-lg neu-inset-sm text-slate-700 dark:text-slate-300 font-mono font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <FileText className="w-4 h-4 text-orange-500 shrink-0" />
                    <div className="min-w-0 truncate">
                      <span className="font-semibold text-slate-900 dark:text-white block truncate">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'} · {item.sizeKb} KB
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0}
                      className="p-2 rounded-xl neu-btn text-slate-600 dark:text-slate-300 disabled:opacity-30 transition-all min-h-[36px] min-w-[36px] flex items-center justify-center"
                      title="Move Up in order"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === pdfItems.length - 1}
                      className="p-2 rounded-xl neu-btn text-slate-600 dark:text-slate-300 disabled:opacity-30 transition-all min-h-[36px] min-w-[36px] flex items-center justify-center"
                      title="Move Down in order"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-2 rounded-xl neu-btn text-red-500 hover:text-red-600 transition-all min-h-[36px] min-w-[36px] flex items-center justify-center"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Merge Action CTA Strip */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-500">
              {pdfItems.length < 2 ? (
                <span className="text-amber-600 dark:text-amber-400 font-semibold">
                  {language === 'hi' ? 'कम से कम 1 और PDF जोड़ें' : 'Add at least 1 more PDF to merge'}
                </span>
              ) : (
                <span>
                  {language === 'hi'
                    ? `सभी ${pdfItems.length} फाइलें (${totalPagesInQueue} पेज) एक PDF में जुड़ेंगी`
                    : `Ready to combine ${pdfItems.length} files (${totalPagesInQueue} pages) into one document`}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleMerge}
              disabled={isProcessing || pdfItems.length < 2}
              className="w-full sm:w-auto px-7 py-3 neu-btn-orange text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px]"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{language === 'hi' ? 'PDF फाइलें मर्ज हो रही हैं...' : 'Merging PDF Documents...'}</span>
                </>
              ) : (
                <>
                  <Files className="w-4 h-4" />
                  <span>
                    {language === 'hi'
                      ? `${pdfItems.length} PDF फाइलें मर्ज करें`
                      : `Merge ${pdfItems.length} PDF Files Now`}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Result Success Card */}
          {mergedBlobUrl && mergedStats && (
            <div className="p-5 sm:p-6 rounded-2xl neu-card space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/60 dark:border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl neu-icon shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                      {language === 'hi' ? 'PDF सफलतापूर्वक मर्ज हो गया!' : 'PDF Successfully Merged!'}
                    </h3>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">
                      {mergedStats.totalPages} Pages · {mergedStats.sizeKb > 1024 ? `${Math.round((mergedStats.sizeKb / 1024) * 10) / 10} MB` : `${mergedStats.sizeKb} KB`} · {mergedStats.fileCount} Documents combined
                    </span>
                  </div>
                </div>

                {/* Output Filename configuration */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Save as:</span>
                  <div className="relative">
                    <input
                      type="text"
                      value={customFileName}
                      onChange={(e) => setCustomFileName(e.target.value)}
                      className="px-3 py-1.5 text-xs neu-input font-mono w-48 sm:w-56"
                    />
                    <span className="absolute right-2.5 top-1.5 text-xs text-slate-400 pointer-events-none">.pdf</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleOpenPreview}
                  className="px-4 py-2.5 neu-btn text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 min-h-[44px]"
                >
                  <Eye className="w-4 h-4 text-orange-500" />
                  <span>{language === 'hi' ? 'ब्राउज़र में देखें (Preview)' : 'Preview in Browser'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-6 py-2.5 neu-btn-emerald text-white font-bold text-xs flex items-center gap-2 min-h-[44px]"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {language === 'hi'
                      ? `मर्ज की गई PDF डाउनलोड करें (${mergedStats.totalPages} पेज)`
                      : `Download Combined PDF (${mergedStats.totalPages} Pages)`}
                  </span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
