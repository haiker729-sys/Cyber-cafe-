import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { createWorker } from 'tesseract.js';
import { Upload, Copy, Download, RefreshCw, FileText, Check, AlertTriangle } from 'lucide-react';

export const OcrTool: React.FC = () => {
  const { language } = useApp();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [ocrLanguage, setOcrLanguage] = useState<'eng' | 'hin' | 'hin+eng'>('hin+eng');

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('');
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setRecognizedText('');
    setProgress(0);
  };

  const runOcr = async () => {
    if (!imageFile) return;
    setLoading(true);
    setProgress(0);
    setStatusText(language === 'hi' ? 'OCR इंजन लोड हो रहा है...' : 'Initializing OCR engine...');

    try {
      const worker = await createWorker(ocrLanguage, 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
            setStatusText(
              language === 'hi'
                ? `अक्षरों को पहचाना जा रहा है (${Math.round(m.progress * 100)}%)...`
                : `Recognizing text (${Math.round(m.progress * 100)}%)...`
            );
          } else {
            setStatusText(m.status);
          }
        },
      });

      const ret = await worker.recognize(imageFile);
      setRecognizedText(ret.data.text);
      await worker.terminate();
    } catch (err: any) {
      console.error(err);
      setStatusText(err.message || 'OCR processing failed');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!recognizedText) return;
    navigator.clipboard.writeText(recognizedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    if (!recognizedText) return;
    const blob = new Blob([recognizedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meraj_cafe_ocr_extracted_text.txt';
    a.click();
  };

  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {language === 'hi' ? 'दस्तावेज़ स्कैनर और OCR (हिंदी + अंग्रेजी)' : 'Document OCR Scanner (Hindi + English)'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Extract editable text directly from printed certificates, books, or marksheets in your browser.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shrink-0">
          Working
        </span>
      </div>

      {/* Honest Disclaimer about Hindi OCR Accuracy */}
      <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-bold">Accuracy Notice: </span>
          {language === 'hi'
            ? 'हिंदी में OCR की सटीकता अंग्रेजी की तुलना में कम हो सकती है। फॉर्म सबमिट करने से पहले पहचाने गए टेक्स्ट को अवश्य जांचें।'
            : 'Hindi OCR accuracy is lower than English and depends heavily on clear photo contrast. Always verify spelling and numbers before submitting.'}
        </p>
      </div>

      {!imagePreview ? (
        <label className="flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl hover:border-orange-500 bg-slate-50 dark:bg-slate-900/50 cursor-pointer">
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {language === 'hi' ? 'दस्तावेज़ की फोटो अपलोड करें' : 'Upload Document Photo'}
          </span>
          <span className="text-xs text-slate-500 mt-1">High resolution photos give highest accuracy</span>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {language === 'hi' ? 'भाषा:' : 'Language:'}
              </span>
              <select
                value={ocrLanguage}
                onChange={(e) => setOcrLanguage(e.target.value as any)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="hin+eng">Hindi + English (दोनों)</option>
                <option value="eng">English Only</option>
                <option value="hin">Hindi Only (हिंदी)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={runOcr}
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-orange-500 text-slate-950 font-bold text-xs hover:bg-orange-400 transition-colors flex items-center gap-2 min-h-[40px]"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              <span>{language === 'hi' ? 'टेक्स्ट निकालें (Extract Text)' : 'Extract Text Now'}</span>
            </button>
          </div>

          {/* Progress Bar during scan */}
          {loading && (
            <div className="space-y-1.5 p-4 rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/50">
              <div className="flex justify-between text-xs font-semibold text-orange-900 dark:text-orange-300">
                <span>{statusText}</span>
                <span className="font-mono">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-orange-100 dark:bg-orange-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Result Text Area */}
          {recognizedText && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Extracted Text (Editable)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={downloadTxt}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download TXT</span>
                  </button>
                </div>
              </div>

              <textarea
                value={recognizedText}
                onChange={(e) => setRecognizedText(e.target.value)}
                rows={8}
                className="w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setImageFile(null);
              setImagePreview(null);
              setRecognizedText('');
            }}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline block"
          >
            {language === 'hi' ? 'दूसरा दस्तावेज़ चुनें' : 'Choose another document'}
          </button>
        </div>
      )}
    </div>
  );
};
