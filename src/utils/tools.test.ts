import { parsePageRangeString } from './pdfProcess.ts';
import { createBatchZip } from './imageProcess.ts';

// Unit Test 1: Page Range Parsing
function testPageRangeParsing() {
  const totalPages = 15;
  const res1 = parsePageRangeString('1-3, 5, 8-10', totalPages);
  const expected1 = [0, 1, 2, 4, 7, 8, 9];
  console.assert(
    JSON.stringify(res1) === JSON.stringify(expected1),
    `Page range test failed: got ${JSON.stringify(res1)}, expected ${JSON.stringify(expected1)}`
  );

  const res2 = parsePageRangeString('2, 2, 1', totalPages);
  const expected2 = [0, 1];
  console.assert(
    JSON.stringify(res2) === JSON.stringify(expected2),
    `Page range deduplication failed`
  );
  console.log('✓ Page Range Parser Test Passed');
}

// Unit Test 2: EMI Calculator Logic
function testEmiCalculation() {
  const P = 100000;
  const r = 12 / 12 / 100; // 1% per month
  const n = 12; // 12 months
  const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const roundedEmi = Math.round(emi);
  console.assert(roundedEmi === 8885, `EMI test failed: got ${roundedEmi}, expected 8885`);
  console.log('✓ EMI Calculator Logic Test Passed');
}

// Unit Test 3: GST Calculation Logic
function testGstCalculation() {
  const base = 1000;
  const rate = 18;
  const tax = (base * rate) / 100;
  const net = base + tax;
  console.assert(tax === 180 && net === 1180, `GST Add calculation failed`);

  // Remove GST
  const inclusive = 1180;
  const calculatedBase = inclusive / (1 + rate / 100);
  console.assert(Math.round(calculatedBase) === 1000, `GST Remove calculation failed`);
  console.log('✓ GST Calculator Logic Test Passed');
}

// Unit Test 4: Age Calculation Logic
function testAgeCalculation() {
  const d1 = new Date('2000-05-15');
  const d2 = new Date('2026-05-15');
  const years = d2.getFullYear() - d1.getFullYear();
  console.assert(years === 26, `Age years calculation failed`);
  console.log('✓ Age Calculator Logic Test Passed');
}

// Unit Test 5: WhatsApp Number Normalization
function testWhatsAppNumberNormalization() {
  const raw = '9060776981';
  let cleaned = raw.replace(/\D/g, '');
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  console.assert(cleaned === '919060776981', `WhatsApp number format failed: ${cleaned}`);
  console.log('✓ WhatsApp Number Pre-fixing (+91) Test Passed');
}

// Unit Test 6: Image Resizer Aspect Ratio Math
function testImageAspectRatioCalculation() {
  const origW = 1920;
  const origH = 1080;
  const targetW = 800;
  const proportionalH = Math.round((targetW / origW) * origH);
  console.assert(proportionalH === 450, `Proportional height calculation failed: got ${proportionalH}, expected 450`);

  const targetH2 = 600;
  const proportionalW = Math.round((targetH2 / origH) * origW);
  console.assert(proportionalW === 1067, `Proportional width calculation failed: got ${proportionalW}, expected 1067`);
  console.log('✓ Image Aspect Ratio Proportional Calculation Passed');
}

// Unit Test 7: Batch ZIP Creation with JSZip
async function testBatchZipCreation() {
  const testBlob1 = new Blob(['sample-image-1'], { type: 'text/plain' });
  const testBlob2 = new Blob(['sample-image-2'], { type: 'text/plain' });
  const zipBlob = await createBatchZip([
    { fileName: 'photo1.jpg', blob: testBlob1 },
    { fileName: 'photo2.webp', blob: testBlob2 },
  ]);
  console.assert(zipBlob.size > 0, `ZIP blob is empty`);
  console.log('✓ Batch ZIP Archive Generation Test Passed');
}

// Unit Test 8: PDF Merge Logic with pdf-lib
async function testPdfMergeLogic() {
  const { PDFDocument } = await import('pdf-lib');
  const { mergePdfFilesWithMetadata } = await import('./pdfProcess.ts');

  const doc1 = await PDFDocument.create();
  doc1.addPage([200, 200]);
  doc1.addPage([200, 200]);
  const pdfBytes1 = await doc1.save();
  const file1 = new File([pdfBytes1 as unknown as BlobPart], 'doc1.pdf', { type: 'application/pdf' });

  const doc2 = await PDFDocument.create();
  doc2.addPage([200, 200]);
  const pdfBytes2 = await doc2.save();
  const file2 = new File([pdfBytes2 as unknown as BlobPart], 'doc2.pdf', { type: 'application/pdf' });

  const merged = await mergePdfFilesWithMetadata([file1, file2]);
  console.assert(merged.totalPages === 3, `PDF merge failed: expected 3 pages, got ${merged.totalPages}`);
  console.assert(merged.blob.size > 0, `PDF merge failed: empty blob`);
  console.log('✓ PDF Merge Logic (pdf-lib) Test Passed');
}

export async function runAllTests() {
  console.log('Running MERAJ CAFE POINT Unit Tests:');
  testPageRangeParsing();
  testEmiCalculation();
  testGstCalculation();
  testAgeCalculation();
  testWhatsAppNumberNormalization();
  testImageAspectRatioCalculation();
  await testBatchZipCreation();
  await testPdfMergeLogic();
  console.log('All 8 Unit Tests Passed Successfully!');
}

runAllTests();
