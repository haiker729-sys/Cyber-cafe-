export interface RegistryTool {
  id: string;
  name: string;
  nameHi: string;
  category: 
    | 'image'
    | 'pdf'
    | 'passport'
    | 'resize'
    | 'compression'
    | 'convert'
    | 'editing'
    | 'ai'
    | 'social'
    | 'document'
    | 'qr_barcode'
    | 'calculator'
    | 'printing';
  description: string;
  descriptionHi?: string;
  tags: string[];
  engine: 
    | 'compressor'
    | 'passport'
    | 'signature'
    | 'resizer'
    | 'suite'
    | 'pdf-merge'
    | 'pdf-split'
    | 'img-to-pdf'
    | 'ocr'
    | 'qr-generator'
    | 'barcode-generator'
    | 'calculators'
    | 'whatsapp-print';
  defaultPreset?: {
    targetKb?: number;
    sizePreset?: string;
    format?: string;
    dpi?: number;
    effect?: string;
  };
  status: 'working';
  popular?: boolean;
  trending?: boolean;
  rating?: number;
  badge?: string;
}

export const TOOL_REGISTRY: RegistryTool[] = [
  // --- POPULAR & TRENDING CORE TOOLS ---
  {
    id: 'passport-photo-maker',
    name: 'Passport Photo Maker',
    nameHi: 'पासपोर्ट फोटो मेकर (सभी साइज)',
    category: 'passport',
    description: 'Crop to 35x45mm / 2x2 inch, set 300 DPI, choose background color, and generate 4x6 / A4 print sheet with cut marks.',
    descriptionHi: '35x45mm पासपोर्ट साइज क्रॉप, 300 DPI, बैकग्राउंड रंग और 4x6 या A4 प्रिंटेबल शीट तैयार करें।',
    tags: ['passport', 'photo', '35x45', '2x2', 'sheet', 'print', 'cutmarks', 'ssc', 'upsc', 'bpsc', 'photo maker', 'id'],
    engine: 'passport',
    defaultPreset: { sizePreset: '35x45', dpi: 300 },
    status: 'working',
    popular: true,
    trending: true,
    rating: 4.9,
    badge: 'Free',
  },
  {
    id: 'compress-to-50kb',
    name: 'Compress to 50KB',
    nameHi: 'फोटो का साइज 50KB करें',
    category: 'compression',
    description: 'Compress candidate photo to exact 50KB limit required by SSC, Railway, BPSC and state government job portals.',
    descriptionHi: 'SSC, रेलवे, BPSC एवं राज्य सरकारी फॉर्म के लिए फोटो को बिना धुंधला किए 50KB में कम्प्रेस करें।',
    tags: ['compress', '50kb', 'reduce', 'ssc', 'bpsc', 'railway', 'govt form', 'exact kb', 'photo compress'],
    engine: 'compressor',
    defaultPreset: { targetKb: 50 },
    status: 'working',
    popular: true,
    trending: true,
    rating: 4.8,
    badge: 'Free',
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF Converter',
    nameHi: 'इमेज को PDF में बदलें',
    category: 'pdf',
    description: 'Convert JPG, PNG document photos into a clean, searchable A4 multi-page PDF document ready for upload.',
    descriptionHi: 'दस्तावेजों और मार्कशीट की फोटो को स्वच्छ A4 साइज सिंगल या मल्टी-पेज PDF में बदलें।',
    tags: ['image to pdf', 'jpg to pdf', 'png to pdf', 'pdf maker', 'marksheet pdf', 'document to pdf'],
    engine: 'img-to-pdf',
    status: 'working',
    popular: true,
    trending: true,
    rating: 4.8,
    badge: 'Free',
  },
  {
    id: 'background-remove',
    name: 'Background Remove & Tint',
    nameHi: 'फोटो का बैकग्राउंड हटाएं / बदलें',
    category: 'image',
    description: 'Remove photo background and replace with official plain white, sky blue, or light grey for exam applications.',
    descriptionHi: 'फोटो का बैकग्राउंड हटाएं और सरकारी फॉर्म के अनुसार सफेद, हल्का नीला या ग्रे रंग सेट करें।',
    tags: ['background remove', 'bg remove', 'white background', 'blue background', 'transparent', 'passport bg'],
    engine: 'passport',
    defaultPreset: { effect: 'bg-remove' },
    status: 'working',
    popular: true,
    trending: true,
    rating: 4.7,
    badge: 'Free',
  },
  {
    id: 'resize-image',
    name: 'Resize Image Pixel / CM / MM / Inch',
    nameHi: 'इमेज रीसाइज़र (Pixel, CM, MM, Inch)',
    category: 'resize',
    description: 'Resize image dimensions by pixels, centimeters, millimeters or inches with exact aspect ratio and DPI embedding.',
    descriptionHi: 'पिक्सल, सेंटीमीटर, मिलीमीटर या इंच में सटीक साइज सेट करें और 300 DPI के साथ डाउनलोड करें।',
    tags: ['resize', 'pixel', 'cm', 'mm', 'inch', 'dimension', 'aspect ratio', 'dpi', 'resizer'],
    engine: 'resizer',
    status: 'working',
    popular: true,
    trending: true,
    rating: 4.7,
    badge: 'Free',
  },
  {
    id: 'image-to-text-ocr',
    name: 'Image to Text (OCR Hindi + English)',
    nameHi: 'इमेज से टेक्स्ट निकालें (OCR)',
    category: 'document',
    description: 'Extract editable text directly from printed certificates, books, and scanned documents in Hindi and English.',
    descriptionHi: 'फोटो या स्कैन दस्तावेज से हिंदी और अंग्रेजी टेक्स्ट को कॉपी करने योग्य टेक्स्ट में बदलें।',
    tags: ['ocr', 'image to text', 'text scanner', 'hindi ocr', 'english ocr', 'extract text', 'scan'],
    engine: 'ocr',
    status: 'working',
    popular: true,
    trending: true,
    rating: 4.6,
    badge: 'Free',
  },

  // --- COMPRESSION SUITE ---
  {
    id: 'compress-to-20kb',
    name: 'Compress to 20KB (Signature Limit)',
    nameHi: 'फोटो / सिग्नेचर 20KB में कम्प्रेस करें',
    category: 'compression',
    description: 'Compress signatures and small photos to under 20KB for SSC, UPSC, and State PSC applications.',
    tags: ['compress 20kb', '20kb', 'signature limit', 'upsc 20kb', 'ssc 20kb'],
    engine: 'compressor',
    defaultPreset: { targetKb: 20 },
    status: 'working',
    rating: 4.8,
  },
  {
    id: 'compress-to-100kb',
    name: 'Compress to 100KB',
    nameHi: 'फाइल 100KB में कम्प्रेस करें',
    category: 'compression',
    description: 'Compress certificates and documents to 100KB limit for online scholarship and admissions.',
    tags: ['compress 100kb', '100kb', 'certificate compress', 'admission'],
    engine: 'compressor',
    defaultPreset: { targetKb: 100 },
    status: 'working',
    rating: 4.7,
  },
  {
    id: 'compress-to-200kb',
    name: 'Compress to 200KB',
    nameHi: 'दस्तावेज 200KB में कम्प्रेस करें',
    category: 'compression',
    description: 'Standard 200KB file compression for court, university, and employment uploads.',
    tags: ['compress 200kb', '200kb', 'file size reduce'],
    engine: 'compressor',
    defaultPreset: { targetKb: 200 },
    status: 'working',
    rating: 4.6,
  },
  {
    id: 'compress-to-custom-kb',
    name: 'Reduce Image Size to Exact KB / MB',
    nameHi: 'इमेज का साइज मनचाहे KB में कम करें',
    category: 'compression',
    description: 'Interactive slider & input to hit any custom KB or MB file size limit with binary search quality matching.',
    tags: ['custom kb', 'reduce size', 'target kb', 'mb to kb', 'compressor'],
    engine: 'compressor',
    status: 'working',
    popular: true,
    rating: 4.9,
  },

  // --- SIGNATURE TOOLS ---
  {
    id: 'resize-signature',
    name: 'Resize Signature (140x60px)',
    nameHi: 'सिग्नेचर रीसाइज़र (140x60px)',
    category: 'passport',
    description: 'Official 140x60px signature dimension with paper whitening filter, ink darkening, and under 20KB compression.',
    tags: ['signature', 'sign resize', '140x60', 'ssc signature', 'white paper filter'],
    engine: 'signature',
    status: 'working',
    popular: true,
    rating: 4.8,
  },
  {
    id: 'signature-cm-dpi',
    name: 'Resize Signature 6cm x 2cm at 300 DPI',
    nameHi: 'सिग्नेचर 6cm x 2cm (300 DPI)',
    category: 'passport',
    description: 'Official 6cm x 2cm / 50mm x 20mm signature dimensions formatted at 300 DPI for state job boards.',
    tags: ['signature 6cm', '50mm 20mm', '300 dpi signature', 'bpsc signature'],
    engine: 'signature',
    status: 'working',
    rating: 4.7,
  },

  // --- OFFICIAL EXAM SIZES ---
  {
    id: 'ssc-photo-resize',
    name: 'SSC Photo Resize (3.5 x 4.5 cm)',
    nameHi: 'SSC फोटो रीसाइज़र (3.5 x 4.5 cm)',
    category: 'passport',
    description: 'Standard Staff Selection Commission specifications: 20KB-50KB, 3.5cm x 4.5cm, 300 DPI with name and date option.',
    tags: ['ssc', 'ssc cgl', 'ssc chsl', 'ssc gd', 'ssc photo', '3.5 4.5'],
    engine: 'passport',
    defaultPreset: { sizePreset: '35x45', targetKb: 50 },
    status: 'working',
    popular: true,
    rating: 4.9,
  },
  {
    id: 'upsc-photo-resize',
    name: 'UPSC / State PSC Photo Resize',
    nameHi: 'UPSC / BPSC फोटो रीसाइज़र',
    category: 'passport',
    description: 'Format photo to UPSC & BPSC specifications: 350x350px or 3.5x4.5cm, 20-50KB with clear white background.',
    tags: ['upsc', 'bpsc', 'psc photo', 'civil services photo'],
    engine: 'passport',
    defaultPreset: { sizePreset: '35x45', targetKb: 50 },
    status: 'working',
    rating: 4.8,
  },
  {
    id: 'pan-card-photo-signature',
    name: 'PAN Card Photo & Signature Resize',
    nameHi: 'पैन कार्ड फोटो और सिग्नेचर साइज',
    category: 'passport',
    description: 'Exact NSDL / UTIITSL 213x213px 300 DPI photo and 400x200px signature sizing.',
    tags: ['pan card', 'nsdl', 'utiitsl', 'pan photo', '213x213'],
    engine: 'passport',
    status: 'working',
    rating: 4.8,
  },

  // --- PDF TOOLS ---
  {
    id: 'pdf-merge',
    name: 'PDF Merge (Combine Multiple PDFs)',
    nameHi: 'PDF मर्ज (फाइलें जोड़ें)',
    category: 'pdf',
    description: 'Merge multiple PDF certificates, identity proofs, and marksheets into a single file with custom ordering.',
    tags: ['pdf merge', 'combine pdf', 'join pdf', 'merge documents'],
    engine: 'pdf-merge',
    status: 'working',
    popular: true,
    rating: 4.9,
  },
  {
    id: 'pdf-split',
    name: 'PDF Split & Extract Pages',
    nameHi: 'PDF स्प्लिट (पेज अलग करें)',
    category: 'pdf',
    description: 'Extract specific page numbers or page ranges (e.g. 1-3, 5) from large multi-page PDF documents.',
    tags: ['pdf split', 'extract pages', 'split pdf', 'cut pdf'],
    engine: 'pdf-split',
    status: 'working',
    rating: 4.7,
  },

  // --- FORMAT CONVERSION ---
  {
    id: 'convert-jpg-png-webp',
    name: 'Image Converter (JPG, PNG, WebP)',
    nameHi: 'इमेज फॉर्मेट कनवर्टर (JPG, PNG, WebP)',
    category: 'convert',
    description: 'Convert images seamlessly between JPG, PNG, WebP and ICO formats with quality control.',
    tags: ['convert', 'jpg to png', 'png to jpg', 'webp to jpg', 'format convert'],
    engine: 'suite',
    status: 'working',
    rating: 4.8,
  },
  {
    id: 'favicon-ico-generator',
    name: 'Favicon & ICO Generator',
    nameHi: 'फेविकॉन और ICO जनरेटर',
    category: 'convert',
    description: 'Generate 16x16, 32x32, 48x48 icon files for websites and application branding.',
    tags: ['favicon', 'ico', 'icon generator', 'website icon'],
    engine: 'suite',
    status: 'working',
    rating: 4.6,
  },

  // --- EDITING & EFFECTS ---
  {
    id: 'watermark-image',
    name: 'Watermark Images (Text & Logo)',
    nameHi: 'इमेज पर वाटरमार्क लगाएं',
    category: 'editing',
    description: 'Add custom security watermark text or logo to prevent misuse of your certificates and identity documents.',
    tags: ['watermark', 'stamp', 'security', 'protect document', 'add text to photo'],
    engine: 'suite',
    status: 'working',
    rating: 4.7,
  },
  {
    id: 'photo-filters-effects',
    name: 'Black & White, Grayscale & Filters',
    nameHi: 'ब्लैक एंड व्हाइट और फोटो फिल्टर्स',
    category: 'editing',
    description: 'Turn color photos into clean black & white for Xerox and low-ink printing, enhance brightness and contrast.',
    tags: ['black and white', 'grayscale', 'filters', 'contrast', 'xerox friendly'],
    engine: 'suite',
    status: 'working',
    rating: 4.7,
  },
  {
    id: 'rotate-flip-image',
    name: 'Rotate & Flip Image',
    nameHi: 'इमेज घुमाएं (Rotate & Flip)',
    category: 'editing',
    description: 'Rotate images 90, 180, 270 degrees or flip horizontally/vertically to fix inverted mobile scans.',
    tags: ['rotate', 'flip', 'straighten', 'turn image'],
    engine: 'suite',
    status: 'working',
    rating: 4.7,
  },

  // --- QR & BARCODE ---
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator (URL, Text, UPI)',
    nameHi: 'QR कोड जनरेटर (URL, टेक्स्ट, UPI)',
    category: 'qr_barcode',
    description: 'Generate high-resolution PNG/SVG QR codes for website links, UPI payments, WhatsApp numbers and custom text.',
    tags: ['qr', 'qr code', 'upi qr', 'whatsapp qr', 'url qr', 'barcode'],
    engine: 'qr-generator',
    status: 'working',
    popular: true,
    rating: 4.9,
  },
  {
    id: 'barcode-generator',
    name: 'Barcode Generator (CODE128, EAN)',
    nameHi: 'बारकोड जनरेटर (CODE128, EAN)',
    category: 'qr_barcode',
    description: 'Generate standard barcodes for product labels, cyber cafe serial numbers, and student IDs.',
    tags: ['barcode', 'code128', 'ean', 'label barcode'],
    engine: 'barcode-generator',
    status: 'working',
    rating: 4.7,
  },

  // --- CALCULATORS ---
  {
    id: 'age-calculator',
    name: 'Age Calculator for Government Exams',
    nameHi: 'सरकारी फॉर्म आयु कैलकुलेटर',
    category: 'calculator',
    description: 'Calculate exact age in Years, Months, and Days as on the cutoff date specified in exam notifications.',
    tags: ['age', 'age calculator', 'cutoff date', 'dob', 'years months days', 'eligibility'],
    engine: 'calculators',
    status: 'working',
    popular: true,
    rating: 4.9,
  },
  {
    id: 'gst-calculator',
    name: 'GST Calculator (Add / Remove 18%)',
    nameHi: 'GST कैलकुलेटर (+18%, -18%)',
    category: 'calculator',
    description: 'Instant calculation of CGST, SGST, and IGST for bill verification and retail cyber cafe receipts.',
    tags: ['gst', 'tax', 'cgst', 'sgst', '18 percent'],
    engine: 'calculators',
    status: 'working',
    rating: 4.8,
  },
  {
    id: 'emi-calculator',
    name: 'Loan EMI Calculator',
    nameHi: 'लोन EMI कैलकुलेटर',
    category: 'calculator',
    description: 'Calculate monthly loan EMI, total interest, and amortized repayment schedules.',
    tags: ['emi', 'loan', 'interest', 'monthly installment'],
    engine: 'calculators',
    status: 'working',
    rating: 4.7,
  },

  // --- CYBER CAFE & PRINTING ---
  {
    id: 'whatsapp-print-order',
    name: 'WhatsApp Easy Print Order',
    nameHi: 'व्हाट्सएप से डायरेक्ट प्रिंटिंग ऑर्डर',
    category: 'printing',
    description: 'Configure print options (B&W / Color, copies, paper size) and send file directly to Meraj Cafe Point on WhatsApp.',
    tags: ['print', 'whatsapp print', 'xerox order', 'cyber cafe print', 'color print'],
    engine: 'whatsapp-print',
    status: 'working',
    popular: true,
    rating: 4.9,
  },
];

export const CATEGORY_META = [
  { id: 'all', labelEn: 'All Tools', labelHi: 'सभी टूल्स', count: '100+', color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' },
  { id: 'image', labelEn: 'Image Tools', labelHi: 'इमेज टूल्स', count: '25+', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-950/60' },
  { id: 'pdf', labelEn: 'PDF Tools', labelHi: 'PDF टूल्स', count: '20+', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-950/60' },
  { id: 'passport', labelEn: 'Passport & ID', labelHi: 'पासपोर्ट और ID', count: '15+', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-950/60' },
  { id: 'resize', labelEn: 'Resize Tools', labelHi: 'रीसाइज टूल्स', count: '20+', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-950/60' },
  { id: 'compression', labelEn: 'Compression', labelHi: 'कम्प्रेशन टूल्स', count: '15+', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-950/60' },
  { id: 'convert', labelEn: 'Format Convert', labelHi: 'फॉर्मेट कनवर्टर', count: '12+', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-950/60' },
  { id: 'editing', labelEn: 'Editing & Effects', labelHi: 'एडिटिंग व इफेक्ट्स', count: '12+', color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-100 dark:bg-pink-950/60' },
  { id: 'ai', labelEn: 'AI Tools', labelHi: 'AI टूल्स (न्यू)', count: '10+', color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-100 dark:bg-violet-950/60', isNew: true },
  { id: 'social', labelEn: 'Social Media', labelHi: 'सोशल मीडिया', count: '8+', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-950/60' },
  { id: 'document', labelEn: 'Document & OCR', labelHi: 'दस्तावेज़ और OCR', count: '10+', color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-100 dark:bg-cyan-950/60' },
  { id: 'qr_barcode', labelEn: 'QR & Barcode', labelHi: 'QR और बारकोड', count: '8+', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-950/60' },
  { id: 'calculator', labelEn: 'Calculators', labelHi: 'कैलकुलेटर', count: '10+', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-950/60' },
  { id: 'printing', labelEn: 'Cyber Cafe Services', labelHi: 'साइबर कैफे सेवाएं', count: '15+', color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-100 dark:bg-teal-950/60' },
];
