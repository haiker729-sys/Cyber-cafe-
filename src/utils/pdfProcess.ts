import { PDFDocument } from 'pdf-lib';

export interface PdfPageRange {
  start: number;
  end: number;
}

/**
 * Parses user-friendly page ranges like "1-3, 5, 8-10" into 0-indexed page indices.
 */
export function parsePageRangeString(rangeStr: string, totalPages: number): number[] {
  const parts = rangeStr.split(',').map((s) => s.trim()).filter(Boolean);
  const selectedIndices = new Set<number>();

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-').map((s) => parseInt(s.trim(), 10));
      if (!isNaN(startStr) && !isNaN(endStr)) {
        const start = Math.max(1, Math.min(startStr, endStr));
        const end = Math.min(totalPages, Math.max(startStr, endStr));
        for (let i = start; i <= end; i++) {
          selectedIndices.add(i - 1);
        }
      }
    } else {
      const page = parseInt(part, 10);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        selectedIndices.add(page - 1);
      }
    }
  }

  return Array.from(selectedIndices).sort((a, b) => a - b);
}

/**
 * Gets the number of pages in a PDF file
 */
export async function getPdfPageCount(file: File): Promise<number> {
  const arrayBuffer = await file.arrayBuffer();
  try {
    const doc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    return doc.getPageCount();
  } catch {
    return 1;
  }
}

/**
 * Merges multiple PDF files into one single PDF document
 */
export async function mergePdfFiles(files: File[]): Promise<Blob> {
  const res = await mergePdfFilesWithMetadata(files);
  return res.blob;
}

/**
 * Merges multiple PDF files with full metadata (total pages, final size)
 */
export async function mergePdfFilesWithMetadata(files: File[]): Promise<{ blob: Blob; totalPages: number; sizeKb: number }> {
  if (files.length === 0) {
    throw new Error('At least one PDF file is required');
  }

  const mergedDoc = await PDFDocument.create();
  let totalPages = 0;

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    try {
      const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const indices = srcDoc.getPageIndices();
      totalPages += indices.length;
      const copiedPages = await mergedDoc.copyPages(srcDoc, indices);
      copiedPages.forEach((page) => mergedDoc.addPage(page));
    } catch {
      throw new Error(`Could not read "${file.name}". It may be password-protected or corrupted.`);
    }
  }

  const mergedBytes = await mergedDoc.save();
  const blob = new Blob([mergedBytes as unknown as BlobPart], { type: 'application/pdf' });
  return {
    blob,
    totalPages,
    sizeKb: Math.round((blob.size / 1024) * 10) / 10,
  };
}

/**
 * Splits a PDF file according to page range string (e.g. "1-2, 4")
 */
export async function splitPdfByRange(file: File, rangeStr: string): Promise<{ blob: Blob; pageCount: number }> {
  const arrayBuffer = await file.arrayBuffer();
  let srcDoc: PDFDocument;

  try {
    srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  } catch {
    throw new Error(`Failed to load "${file.name}". It might be password-protected or corrupted.`);
  }

  const totalPages = srcDoc.getPageCount();
  const pageIndices = parsePageRangeString(rangeStr, totalPages);

  if (pageIndices.length === 0) {
    throw new Error(`No valid pages selected. The document has ${totalPages} pages.`);
  }

  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
  copiedPages.forEach((page) => newDoc.addPage(page));

  const pdfBytes = await newDoc.save();
  return {
    blob: new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' }),
    pageCount: pageIndices.length,
  };
}

/**
 * Splits selected pages into individual single-page PDF files
 */
export async function splitPdfToIndividualPages(
  file: File,
  pageIndices: number[]
): Promise<Array<{ pageNumber: number; blob: Blob; sizeKb: number }>> {
  const arrayBuffer = await file.arrayBuffer();
  let srcDoc: PDFDocument;
  try {
    srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  } catch {
    throw new Error(`Failed to load "${file.name}". It might be password-protected or corrupted.`);
  }

  const results: Array<{ pageNumber: number; blob: Blob; sizeKb: number }> = [];

  for (const pageIdx of pageIndices) {
    const singleDoc = await PDFDocument.create();
    const copied = await singleDoc.copyPages(srcDoc, [pageIdx]);
    singleDoc.addPage(copied[0]);
    const bytes = await singleDoc.save();
    const blob = new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });
    results.push({
      pageNumber: pageIdx + 1,
      blob,
      sizeKb: Math.round((blob.size / 1024) * 10) / 10,
    });
  }

  return results;
}

/**
 * Converts multiple image files into an A4 or custom-fit PDF
 */
export async function imagesToPdf(
  images: File[],
  fitA4: boolean = true,
  marginPt: number = 20
): Promise<Blob> {
  if (images.length === 0) {
    throw new Error('No images provided for PDF conversion');
  }

  const doc = await PDFDocument.create();
  // Standard A4 dimensions in points: 595.28 x 841.89 (72 points per inch)
  const A4_WIDTH = 595.28;
  const A4_HEIGHT = 841.89;

  for (const imageFile of images) {
    const imageBytes = await imageFile.arrayBuffer();
    let embeddedImg;

    if (imageFile.type === 'image/jpeg' || imageFile.type === 'image/jpg') {
      embeddedImg = await doc.embedJpg(imageBytes);
    } else if (imageFile.type === 'image/png') {
      embeddedImg = await doc.embedPng(imageBytes);
    } else {
      // Convert WebP or other formats via canvas to JPEG
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });

      const img = new Image();
      img.src = dataUrl;
      await new Promise((res) => {
        img.onload = res;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }
      const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      const res = await fetch(jpegDataUrl);
      const convertedBytes = await res.arrayBuffer();
      embeddedImg = await doc.embedJpg(convertedBytes);
    }

    if (fitA4) {
      const page = doc.addPage([A4_WIDTH, A4_HEIGHT]);
      const availableWidth = A4_WIDTH - marginPt * 2;
      const availableHeight = A4_HEIGHT - marginPt * 2;

      // Scale keeping aspect ratio
      const imgAspect = embeddedImg.width / embeddedImg.height;
      const pageAspect = availableWidth / availableHeight;

      let drawWidth = availableWidth;
      let drawHeight = availableHeight;

      if (imgAspect > pageAspect) {
        drawHeight = drawWidth / imgAspect;
      } else {
        drawWidth = drawHeight * imgAspect;
      }

      const x = marginPt + (availableWidth - drawWidth) / 2;
      const y = marginPt + (availableHeight - drawHeight) / 2;

      page.drawImage(embeddedImg, {
        x,
        y,
        width: drawWidth,
        height: drawHeight,
      });
    } else {
      // Match exact image dimensions
      const page = doc.addPage([embeddedImg.width, embeddedImg.height]);
      page.drawImage(embeddedImg, {
        x: 0,
        y: 0,
        width: embeddedImg.width,
        height: embeddedImg.height,
      });
    }
  }

  const pdfBytes = await doc.save();
  return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
}
