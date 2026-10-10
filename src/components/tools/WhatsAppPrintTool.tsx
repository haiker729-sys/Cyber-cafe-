import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Printer, MessageCircle, FileText, CheckCircle2 } from 'lucide-react';

export const WhatsAppPrintTool: React.FC = () => {
  const { language, shopSettings } = useApp();

  const [docType, setDocType] = useState('Admit Card / Hall Ticket');
  const [printColor, setPrintColor] = useState<'bw' | 'color'>('bw');
  const [sides, setSides] = useState<'single' | 'double'>('single');
  const [paperType, setPaperType] = useState('75 GSM Standard');
  const [pageCount, setPageCount] = useState<number>(1);
  const [copies, setCopies] = useState<number>(1);
  const [needLamination, setNeedLamination] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>('');
  const [specialNote, setSpecialNote] = useState<string>('');

  const generateWhatsAppMessage = (): string => {
    const lines = [
      `*MERAJ CAFE POINT - PRINT ORDER*`,
      `👤 Name: ${customerName || 'Customer'}`,
      `📄 Document: ${docType}`,
      `🎨 Color: ${printColor === 'bw' ? 'Black & White (B&W)' : 'Full Color'}`,
      `🔄 Print Sides: ${sides === 'single' ? 'Single-Sided' : 'Back-to-Back (Double)'}`,
      `📑 Pages: ${pageCount}`,
      `🔢 Copies: ${copies}`,
      `📜 Paper: ${paperType}`,
      `🛡️ Lamination: ${needLamination ? 'Yes Required' : 'No'}`,
    ];
    if (specialNote.trim()) {
      lines.push(`📝 Note: ${specialNote.trim()}`);
    }
    lines.push(`\nSir, I am sending the document file below. Please print it.`);
    return lines.join('\n');
  };

  const handleSendOrder = () => {
    const msg = generateWhatsAppMessage();
    const url = `https://wa.me/91${shopSettings.whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="neu-card p-5 sm:p-7 space-y-6">
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/60 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl neu-icon">
            <Printer className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {language === 'hi' ? 'व्हाट्सएप से डायरेक्ट प्रिंटिंग ऑर्डर' : 'WhatsApp Easy Print Order'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'hi'
                ? 'प्रिंटिंग निर्देश सेट करें और अपनी PDF/फोटो सीधे मेराज कैफे पॉइंट के व्हाट्सएप पर भेजें'
                : 'Configure your print instructions and send file directly to Meraj Cafe Point on WhatsApp'}
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-xl neu-inset-sm text-emerald-600 dark:text-emerald-400 shrink-0">
          Working
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Form Inputs (7 cols) */}
        <div className="md:col-span-7 space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Rahul Kumar"
                className="w-full px-3.5 py-2.5 text-sm neu-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Document Type
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm neu-input font-semibold"
              >
                <option value="Admit Card / Hall Ticket">Admit Card / Hall Ticket</option>
                <option value="Resume / CV">Resume / Biodata</option>
                <option value="Certificate / Marksheet">Certificate / Marksheet</option>
                <option value="Aadhaar / Voter ID / PAN">ID Card / PVC Print</option>
                <option value="Legal Agreement / Stamp">Legal Agreement</option>
                <option value="Study Notes / PDF Book">Study Notes / Book</option>
                <option value="Other Document">Other Document</option>
              </select>
            </div>
          </div>

          {/* Color & Sides */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Color Mode
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl neu-inset-sm">
                <button
                  type="button"
                  onClick={() => setPrintColor('bw')}
                  className={`py-1.5 text-xs font-bold rounded-lg text-center transition-all ${
                    printColor === 'bw'
                      ? 'neu-tab-active bg-[#E8EDF5] dark:bg-[#1B1E27] text-orange-600 dark:text-orange-400'
                      : 'neu-tab-idle'
                  }`}
                >
                  B & W
                </button>
                <button
                  type="button"
                  onClick={() => setPrintColor('color')}
                  className={`py-1.5 text-xs font-bold rounded-lg text-center transition-all ${
                    printColor === 'color'
                      ? 'neu-tab-active bg-[#E8EDF5] dark:bg-[#1B1E27] text-orange-600 dark:text-orange-400'
                      : 'neu-tab-idle'
                  }`}
                >
                  Color
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Print Sides
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl neu-inset-sm">
                <button
                  type="button"
                  onClick={() => setSides('single')}
                  className={`py-1.5 text-xs font-bold rounded-lg text-center transition-all ${
                    sides === 'single'
                      ? 'neu-tab-active bg-[#E8EDF5] dark:bg-[#1B1E27] text-orange-600 dark:text-orange-400'
                      : 'neu-tab-idle'
                  }`}
                >
                  1-Sided
                </button>
                <button
                  type="button"
                  onClick={() => setSides('double')}
                  className={`py-1.5 text-xs font-bold rounded-lg text-center transition-all ${
                    sides === 'double'
                      ? 'neu-tab-active bg-[#E8EDF5] dark:bg-[#1B1E27] text-orange-600 dark:text-orange-400'
                      : 'neu-tab-idle'
                  }`}
                >
                  2-Sided
                </button>
              </div>
            </div>
          </div>

          {/* Counts & Paper */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                Pages Count
              </label>
              <input
                type="number"
                min="1"
                value={pageCount}
                onChange={(e) => setPageCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 text-xs neu-input font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                Copies Count
              </label>
              <input
                type="number"
                min="1"
                value={copies}
                onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 text-xs neu-input font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                Paper Type
              </label>
              <select
                value={paperType}
                onChange={(e) => setPaperType(e.target.value)}
                className="w-full px-2 py-2 text-xs neu-input font-medium"
              >
                <option value="75 GSM Standard">75 GSM A4</option>
                <option value="100 GSM Bond">100 GSM Thick</option>
                <option value="Photo Glossy Paper">Glossy Photo</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={needLamination}
              onChange={(e) => setNeedLamination(e.target.checked)}
              className="rounded text-orange-500 focus:ring-orange-500"
            />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {language === 'hi' ? 'लेमिनेशन भी चाहिए (Waterproof Lamination)' : 'Lamination Required'}
            </span>
          </label>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Special Instructions (Optional)
            </label>
            <input
              type="text"
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
              placeholder="e.g. Please print page 1 only in color, rest B&W"
              className="w-full px-3.5 py-2 text-xs neu-input"
            />
          </div>
        </div>

        {/* Preview & Action Card (5 cols) */}
        <div className="md:col-span-5 neu-inset p-6 rounded-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
              <Printer className="w-4 h-4 text-orange-500" />
              <span>Order Summary</span>
            </div>

            <div className="space-y-2 text-xs divide-y divide-white/60 dark:divide-white/5">
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Document:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{docType}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Mode:</span>
                <span className="font-semibold">{printColor === 'bw' ? 'B&W Laser' : 'Color Laser'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Sides:</span>
                <span>{sides === 'single' ? 'Single' : 'Double (B2B)'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Total Impressions:</span>
                <span className="font-mono font-bold">{pageCount * copies} pages</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Lamination:</span>
                <span>{needLamination ? 'Yes' : 'No'}</span>
              </div>
            </div>

            <div className="mt-4 p-3.5 rounded-xl neu-card-sm text-[11px] text-emerald-800 dark:text-emerald-300 space-y-1">
              <div className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero wait time at shop!</span>
              </div>
              <p>Your documents will be printed and kept ready before you arrive.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSendOrder}
            className="w-full py-3 neu-btn-emerald text-white font-bold text-xs flex items-center justify-center gap-2 min-h-[44px]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{language === 'hi' ? 'व्हाट्सएप पर फाइल भेजें' : 'Send Order on WhatsApp'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
