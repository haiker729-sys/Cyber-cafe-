import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { mergePdfFiles, splitPdfByRange, imagesToPdf } from '../../utils/pdfProcess.ts';
import { Upload, Download, RefreshCw, Files, Scissors, Image as ImageIcon, AlertCircle, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

export const PdfTools: React.FC = () => {
  const { language } = useApp();
  const [activeTab, setActiveTab] = useState<'merge' | 'split' | 'img2pdf'>('merge');

  // Merge state
  const [mergeFiles, setMergeFiles] = useState<File[]>([]);
  const [mergeLoading, setMergeLoading] = useState(false);
  const [mergeResultUrl, setMergeResultUrl] = useState<string | null>(null);

  // Split state
  const [splitFile, setSplitFile] = useState<File | null>(null);
  const [splitRange, setSplitRange] = useState<string>('1-2');
  const [splitLoading, setSplitLoading] = useState(false);
  const [splitResultUrl, setSplitResultUrl] = useState<string | null>(null);
  const [splitPageCount, setSplitPageCount] = useState<number>(0);

  // Images to PDF state
  const [imgFiles, setImgFiles] = useState<File[]>([]);
  const [fitA4, setFitA4] = useState(true);
  const [img2PdfLoading, setImg2PdfLoading] = useState(false);
  const [img2PdfResultUrl, setImg2PdfResultUrl] = useState<string | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Handle Merge
  const handleMergeFilesAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMergeFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
      setMergeResultUrl(null);
      setErrorMsg(null);
    }
  };

  const removeMergeFile = (index: number) => {
    setMergeFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const moveMergeFile = (index: number, direction: 'up' | 'down') => {
    setMergeFiles((prev) => {
      const copy = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= copy.length) return copy;
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const runMerge = async () => {
    if (mergeFiles.length < 2) {
      setErrorMsg(language === 'hi' ? 'कम से कम 2 PDF फाइलें जोड़ें।' : 'Please select at least 2 PDF files to merge.');
      return;
    }
    setMergeLoading(true);
    setErrorMsg(null);
    try {
      const mergedBlob = await mergePdfFiles(mergeFiles);
      setMergeResultUrl(URL.createObjectURL(mergedBlob));
    } catch (err: any) {
      setErrorMsg(err.message || 'PDF Merge failed');
    } finally {
      setMergeLoading(false);
    }
  };

  // Handle Split
  const handleSplitFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setSplitFile(f);
      setSplitResultUrl(null);
      setErrorMsg(null);
    }
  };

  const runSplit = async () => {
    if (!splitFile) return;
    setSplitLoading(true);
    setErrorMsg(null);
    try {
      const res = await splitPdfByRange(splitFile, splitRange);
      setSplitResultUrl(URL.createObjectURL(res.blob));
      setSplitPageCount(res.pageCount);
    } catch (err: any) {
      setErrorMsg(err.message || 'PDF Split failed');
    } finally {
      setSplitLoading(false);
    }
  };

  // Handle Images to PDF
  const handleImgFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImgFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
      setImg2PdfResultUrl(null);
      setErrorMsg(null);
    }
  };

  const runImg2Pdf = async () => {
    if (imgFiles.length === 0) return;
    setImg2PdfLoading(true);
    setErrorMsg(null);
    try {
      const blob = await imagesToPdf(imgFiles, fitA4);
      setImg2PdfResultUrl(URL.createObjectURL(blob));
    } catch (err: any) {
      setErrorMsg(err.message || 'Image to PDF conversion failed');
    } finally {
      setImg2PdfLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {language === 'hi' ? 'PDF टूल्स सूट (मर्ज, स्प्लिट, फोटो से PDF)' : 'PDF Tools Suite (Merge, Split, Img to PDF)'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            100% private in-browser processing via pdf-lib. No documents uploaded to external servers.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shrink-0">
          Working
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl mb-6 max-w-md">
        <button
          type="button"
          onClick={() => { setActiveTab('merge'); setErrorMsg(null); }}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'merge'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Files className="w-3.5 h-3.5 text-orange-500" />
          <span>{language === 'hi' ? 'PDF मर्ज' : 'Merge PDF'}</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('split'); setErrorMsg(null); }}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'split'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Scissors className="w-3.5 h-3.5 text-orange-500" />
          <span>{language === 'hi' ? 'PDF स्प्लिट' : 'Split PDF'}</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('img2pdf'); setErrorMsg(null); }}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'img2pdf'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5 text-orange-500" />
          <span>{language === 'hi' ? 'फोटो से PDF' : 'Images to PDF'}</span>
        </button>
      </div>

      {/* Global Error Banner */}
      {errorMsg && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* TAB 1: MERGE PDF */}
      {activeTab === 'merge' && (
        <div className="space-y-4">
          <label className="flex flex-col items-center justify-center p-6 sm:p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl hover:border-orange-500 bg-slate-50 dark:bg-slate-900/50 cursor-pointer transition-colors">
            <Upload className="w-8 h-8 text-slate-400 mb-2" />
            <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
              {language === 'hi' ? '+ PDF फाइलें जोड़ें (एक साथ कई चुन सकते हैं)' : '+ Add PDF Files to Merge'}
            </span>
            <input type="file" accept="application/pdf" multiple onChange={handleMergeFilesAdd} className="hidden" />
          </label>

          {mergeFiles.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Files Queue ({mergeFiles.length})
              </span>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/30">
                {mergeFiles.map((f, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-slate-400">{idx + 1}.</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{f.name}</span>
                      <span className="text-slate-400">({Math.round(f.size / 1024)} KB)</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => moveMergeFile(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveMergeFile(idx, 'down')}
                        disabled={idx === mergeFiles.length - 1}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeMergeFile(idx)}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-950/50 text-red-600 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={runMerge}
                  disabled={mergeLoading || mergeFiles.length < 2}
                  className="px-5 py-2.5 rounded-xl bg-orange-500 text-slate-950 font-bold text-xs hover:bg-orange-400 transition-colors flex items-center gap-2 disabled:opacity-50 min-h-[44px]"
                >
                  {mergeLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Files className="w-4 h-4" />}
                  <span>{language === 'hi' ? 'फाइलों को मर्ज करें' : 'Merge Files Now'}</span>
                </button>

                {mergeResultUrl && (
                  <a
                    href={mergeResultUrl}
                    download="meraj_cafe_merged.pdf"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors flex items-center gap-2 min-h-[44px]"
                  >
                    <Download className="w-4 h-4" />
                    <span>{language === 'hi' ? 'मर्ज की गई PDF डाउनलोड' : 'Download Merged PDF'}</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SPLIT PDF */}
      {activeTab === 'split' && (
        <div className="space-y-4">
          {!splitFile ? (
            <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl hover:border-orange-500 bg-slate-50 dark:bg-slate-900/50 cursor-pointer">
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                {language === 'hi' ? 'स्प्लिट करने के लिए PDF चुनें' : 'Choose PDF to Split'}
              </span>
              <input type="file" accept="application/pdf" onChange={handleSplitFile} className="hidden" />
            </label>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{splitFile.name}</span>
                <button
                  type="button"
                  onClick={() => { setSplitFile(null); setSplitResultUrl(null); }}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'hi' ? 'पेज रेंज दर्ज करें (जैसे: 1-2, 4):' : 'Enter Page Range (e.g. 1-2, 5):'}
                </label>
                <input
                  type="text"
                  value={splitRange}
                  onChange={(e) => setSplitRange(e.target.value)}
                  placeholder="1-3, 5"
                  className="w-full sm:w-80 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={runSplit}
                  disabled={splitLoading}
                  className="px-5 py-2.5 rounded-xl bg-orange-500 text-slate-950 font-bold text-xs hover:bg-orange-400 transition-colors flex items-center gap-2 min-h-[44px]"
                >
                  {splitLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Scissors className="w-4 h-4" />}
                  <span>{language === 'hi' ? 'पेज अलग करें' : 'Extract Pages'}</span>
                </button>

                {splitResultUrl && (
                  <a
                    href={splitResultUrl}
                    download={`meraj_cafe_extracted_pages_${splitRange}.pdf`}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors flex items-center gap-2 min-h-[44px]"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download ({splitPageCount} Pages)</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: IMAGES TO PDF */}
      {activeTab === 'img2pdf' && (
        <div className="space-y-4">
          <label className="flex flex-col items-center justify-center p-6 sm:p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl hover:border-orange-500 bg-slate-50 dark:bg-slate-900/50 cursor-pointer">
            <Upload className="w-8 h-8 text-slate-400 mb-2" />
            <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
              {language === 'hi' ? '+ तस्वीरें जोड़ें (JPG, PNG)' : '+ Add Images to Convert'}
            </span>
            <input type="file" accept="image/*" multiple onChange={handleImgFiles} className="hidden" />
          </label>

          {imgFiles.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {imgFiles.length} Photos Selected
                </span>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={fitA4}
                    onChange={(e) => setFitA4(e.target.checked)}
                    className="rounded text-orange-500"
                  />
                  <span>Fit to standard A4 page</span>
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {imgFiles.map((f, i) => (
                  <div key={i} className="p-2 border rounded-lg bg-slate-50 dark:bg-slate-900 text-[11px] truncate flex items-center justify-between">
                    <span className="truncate">{f.name}</span>
                    <button
                      type="button"
                      onClick={() => setImgFiles((prev) => prev.filter((_, idx) => idx !== i))}
                      className="text-red-500 ml-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={runImg2Pdf}
                  disabled={img2PdfLoading}
                  className="px-5 py-2.5 rounded-xl bg-orange-500 text-slate-950 font-bold text-xs hover:bg-orange-400 transition-colors flex items-center gap-2 min-h-[44px]"
                >
                  {img2PdfLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                  <span>{language === 'hi' ? 'PDF बनाएं' : 'Generate PDF'}</span>
                </button>

                {img2PdfResultUrl && (
                  <a
                    href={img2PdfResultUrl}
                    download="meraj_cafe_photos.pdf"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors flex items-center gap-2 min-h-[44px]"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Clean PDF</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
