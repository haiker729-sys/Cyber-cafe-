import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import { QrCode, Barcode, Download, Send, CreditCard, Link as LinkIcon, Check } from 'lucide-react';

export const QrBarcodeTool: React.FC = () => {
  const { language } = useApp();
  const [activeTab, setActiveTab] = useState<'qr' | 'barcode'>('qr');

  // QR Mode: 'url' | 'whatsapp' | 'upi'
  const [qrType, setQrType] = useState<'url' | 'whatsapp' | 'upi'>('whatsapp');
  const [plainText, setPlainText] = useState('https://merajcafepoint.in');
  
  // WhatsApp QR
  const [waNumber, setWaNumber] = useState('9060776981');
  const [waMessage, setWaMessage] = useState('Hello, I need cyber cafe assistance.');

  // UPI QR
  const [upiId, setUpiId] = useState('');
  const [upiName, setUpiName] = useState('MERAJ CAFE POINT');
  const [upiAmount, setUpiAmount] = useState('');

  // QR Customization
  const [qrColor, setQrColor] = useState('#000000');
  const [qrBg, setQrBg] = useState('#FFFFFF');
  const [qrEcLevel, setQrEcLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');

  const [qrPngUrl, setQrPngUrl] = useState<string>('');
  const [qrSvgString, setQrSvgString] = useState<string>('');

  // Barcode state
  const [barcodeText, setBarcodeText] = useState('123456789012');
  const [barcodeFormat, setBarcodeFormat] = useState<'CODE128' | 'CODE39' | 'EAN13'>('CODE128');
  const [barcodeError, setBarcodeError] = useState<string | null>(null);
  const barcodeSvgRef = useRef<SVGSVGElement | null>(null);

  // Generate QR payload
  const getQrPayload = (): string => {
    if (qrType === 'whatsapp') {
      let cleaned = waNumber.replace(/\D/g, '');
      if (cleaned.length === 10) {
        cleaned = '91' + cleaned;
      }
      return `https://wa.me/${cleaned}?text=${encodeURIComponent(waMessage)}`;
    }
    if (qrType === 'upi') {
      let upiStr = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&cu=INR`;
      if (upiAmount && parseFloat(upiAmount) > 0) {
        upiStr += `&am=${encodeURIComponent(upiAmount)}`;
      }
      return upiStr;
    }
    return plainText;
  };

  // Render QR Code
  useEffect(() => {
    const payload = getQrPayload();
    if (!payload) return;

    // PNG
    QRCode.toDataURL(payload, {
      errorCorrectionLevel: qrEcLevel,
      color: { dark: qrColor, light: qrBg },
      width: 400,
      margin: 2,
    })
      .then((url) => setQrPngUrl(url))
      .catch(console.error);

    // SVG
    QRCode.toString(payload, {
      type: 'svg',
      errorCorrectionLevel: qrEcLevel,
      color: { dark: qrColor, light: qrBg },
      margin: 2,
    })
      .then((svg) => setQrSvgString(svg))
      .catch(console.error);
  }, [qrType, plainText, waNumber, waMessage, upiId, upiName, upiAmount, qrColor, qrBg, qrEcLevel]);

  // Render Barcode
  useEffect(() => {
    if (activeTab !== 'barcode' || !barcodeSvgRef.current) return;
    try {
      JsBarcode(barcodeSvgRef.current, barcodeText, {
        format: barcodeFormat,
        lineColor: '#000000',
        width: 2,
        height: 80,
        displayValue: true,
      });
      setBarcodeError(null);
    } catch (err: any) {
      setBarcodeError(err.message || 'Invalid barcode format or length');
    }
  }, [barcodeText, barcodeFormat, activeTab]);

  const downloadQrPng = () => {
    if (!qrPngUrl) return;
    const a = document.createElement('a');
    a.href = qrPngUrl;
    a.download = `meraj_cafe_${qrType}_qr.png`;
    a.click();
  };

  const downloadQrSvg = () => {
    if (!qrSvgString) return;
    const blob = new Blob([qrSvgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meraj_cafe_${qrType}_qr.svg`;
    a.click();
  };

  const downloadBarcodePng = () => {
    if (!barcodeSvgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(barcodeSvgRef.current);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = `barcode_${barcodeText}.png`;
        a.click();
      }
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {language === 'hi' ? 'QR और बारकोड जनरेटर' : 'QR & Barcode Generator'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Instant WhatsApp QR (+91 auto-fixed), UPI payment QR, and CODE128/EAN-13 barcodes.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shrink-0">
          Working
        </span>
      </div>

      {/* Main Mode Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('qr')}
          className={`px-4 py-2 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition-colors min-h-[40px] ${
            activeTab === 'qr'
              ? 'bg-orange-500 text-slate-950 border-orange-500 shadow-xs'
              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>QR Code</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('barcode')}
          className={`px-4 py-2 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition-colors min-h-[40px] ${
            activeTab === 'barcode'
              ? 'bg-orange-500 text-slate-950 border-orange-500 shadow-xs'
              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
          }`}
        >
          <Barcode className="w-4 h-4" />
          <span>Barcode</span>
        </button>
      </div>

      {/* QR CODE GENERATOR */}
      {activeTab === 'qr' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7 space-y-4">
            
            {/* Sub-types */}
            <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
              <button
                type="button"
                onClick={() => setQrType('whatsapp')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 ${
                  qrType === 'whatsapp' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Send className="w-3.5 h-3.5 text-green-500" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => setQrType('upi')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 ${
                  qrType === 'upi' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-blue-500" />
                <span>UPI Payment</span>
              </button>

              <button
                type="button"
                onClick={() => setQrType('url')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 ${
                  qrType === 'url' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5 text-orange-500" />
                <span>Link / Text</span>
              </button>
            </div>

            {/* WhatsApp Inputs */}
            {qrType === 'whatsapp' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    WhatsApp Phone Number (10 digits auto +91)
                  </label>
                  <input
                    type="tel"
                    value={waNumber}
                    onChange={(e) => setWaNumber(e.target.value)}
                    placeholder="9060776981"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Pre-filled Message
                  </label>
                  <textarea
                    value={waMessage}
                    onChange={(e) => setWaMessage(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>
            )}

            {/* UPI Inputs */}
            {qrType === 'upi' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    UPI ID (e.g. mobile@upi or name@okaxis)
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="9060776981@ybl"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Receiver Name
                    </label>
                    <input
                      type="text"
                      value={upiName}
                      onChange={(e) => setUpiName(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Optional Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={upiAmount}
                      onChange={(e) => setUpiAmount(e.target.value)}
                      placeholder="Optional"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* URL Inputs */}
            {qrType === 'url' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Website Link or Plain Text
                </label>
                <input
                  type="text"
                  value={plainText}
                  onChange={(e) => setPlainText(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
            )}

            {/* Customization Options */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  QR Color
                </label>
                <input
                  type="color"
                  value={qrColor}
                  onChange={(e) => setQrColor(e.target.value)}
                  className="w-full h-8 rounded border p-0.5 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Background
                </label>
                <input
                  type="color"
                  value={qrBg}
                  onChange={(e) => setQrBg(e.target.value)}
                  className="w-full h-8 rounded border p-0.5 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Error Correction
                </label>
                <select
                  value={qrEcLevel}
                  onChange={(e) => setQrEcLevel(e.target.value as any)}
                  className="w-full px-2 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="L">L (7%)</option>
                  <option value="M">M (15%)</option>
                  <option value="Q">Q (25%)</option>
                  <option value="H">H (30%)</option>
                </select>
              </div>
            </div>
          </div>

          {/* QR Preview Column */}
          <div className="md:col-span-5 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/60 p-6 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
              HD QR Code Preview
            </span>

            {qrPngUrl && (
              <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200 mb-4 inline-block">
                <img src={qrPngUrl} alt="QR Code" className="w-48 h-48 object-contain" />
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={downloadQrPng}
                className="px-3.5 py-2 rounded-xl bg-orange-500 text-slate-950 font-bold text-xs hover:bg-orange-400 transition-colors flex items-center gap-1.5 shadow-xs min-h-[40px]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PNG</span>
              </button>

              <button
                type="button"
                onClick={downloadQrSvg}
                className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors flex items-center gap-1.5 min-h-[40px]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download SVG</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BARCODE GENERATOR */}
      {activeTab === 'barcode' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Barcode Format
              </label>
              <select
                value={barcodeFormat}
                onChange={(e) => setBarcodeFormat(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
              >
                <option value="CODE128">CODE128 (Letters & Numbers - Most Flexible)</option>
                <option value="CODE39">CODE39 (Alphanumeric)</option>
                <option value="EAN13">EAN13 (12 or 13 digits product code)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Barcode Content
              </label>
              <input
                type="text"
                value={barcodeText}
                onChange={(e) => setBarcodeText(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
              />
              {barcodeFormat === 'EAN13' && (
                <span className="text-[11px] text-slate-500 block mt-1">
                  EAN-13 requires exactly 12 or 13 numeric digits.
                </span>
              )}
            </div>

            {barcodeError && (
              <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300">
                {barcodeError}
              </div>
            )}
          </div>

          <div className="md:col-span-6 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/60 p-6 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
              Generated Barcode
            </span>

            <div className="p-4 bg-white rounded-xl shadow-xs border border-slate-200 mb-4 inline-block max-w-full overflow-x-auto">
              <svg ref={barcodeSvgRef} className="max-w-full" />
            </div>

            <button
              type="button"
              onClick={downloadBarcodePng}
              disabled={Boolean(barcodeError)}
              className="px-5 py-2.5 rounded-xl bg-orange-500 text-slate-950 font-bold text-xs hover:bg-orange-400 transition-colors flex items-center gap-2 shadow-xs disabled:opacity-50 min-h-[44px]"
            >
              <Download className="w-4 h-4" />
              <span>Download Barcode PNG</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
