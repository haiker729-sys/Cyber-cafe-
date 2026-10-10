import { injectJfifDpi } from './jfifDpi.ts';
import JSZip from 'jszip';

export interface ImageProcessOptions {
  width?: number; // exact target width in px
  height?: number; // exact target height in px
  maxWidth?: number;
  maxHeight?: number;
  maintainAspectRatio?: boolean;
  targetKb?: number; // e.g. 20, 50, 100
  quality?: number; // 0.1 to 1.0
  format?: 'image/jpeg' | 'image/png' | 'image/webp';
  dpi?: number; // DPI metadata for JPG
}

// Kept for backward compatibility
export type ImageCompressOptions = ImageProcessOptions;

export interface CompressResult {
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
  sizeKb: number;
}

export interface BatchItemResult {
  id: string;
  originalName: string;
  originalSizeKb: number;
  result: CompressResult;
  status: 'done' | 'error';
  errorMessage?: string;
}

/**
 * Loads an image file or object URL into an HTMLImageElement
 */
export function loadImage(src: string | File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));

    if (src instanceof File) {
      const url = URL.createObjectURL(src);
      img.src = url;
    } else {
      img.src = src;
    }
  });
}

/**
 * Robust image processing supporting Compressor, Resizer, and Converter.
 * - Formats: JPEG, PNG, WebP
 * - Target KB via iterative binary search (searches quality, then reduces dimensions if needed)
 * - Exact width & height in pixels (with optional aspect ratio lock)
 * - DPI JFIF metadata injection for JPEG
 */
export async function processImageWithControls(
  imageSource: HTMLImageElement | File,
  options: ImageProcessOptions
): Promise<CompressResult> {
  const img = imageSource instanceof HTMLImageElement ? imageSource : await loadImage(imageSource);
  const format = options.format || 'image/jpeg';
  const targetKb = options.targetKb && options.targetKb > 0 ? options.targetKb : undefined;
  const dpi = options.dpi || 300;

  // Calculate target dimensions
  let targetW = options.width || (options.maxWidth ? Math.min(img.naturalWidth, options.maxWidth) : img.naturalWidth);
  let targetH = options.height || (options.maxHeight ? Math.min(img.naturalHeight, options.maxHeight) : img.naturalHeight);

  if (options.maintainAspectRatio) {
    const aspect = img.naturalWidth / img.naturalHeight;
    if (options.width && !options.height) {
      targetH = Math.round(options.width / aspect);
    } else if (!options.width && options.height) {
      targetW = Math.round(options.height * aspect);
    } else if (options.width && options.height) {
      // Fit within box while keeping aspect
      const boxAspect = options.width / options.height;
      if (aspect > boxAspect) {
        targetW = options.width;
        targetH = Math.round(options.width / aspect);
      } else {
        targetH = options.height;
        targetW = Math.round(options.height * aspect);
      }
    }
  }

  // Ensure minimum valid pixel dimensions
  targetW = Math.max(10, Math.round(targetW));
  targetH = Math.max(10, Math.round(targetH));

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  // Helper to render canvas to blob
  const renderBlob = async (w: number, h: number, q: number): Promise<Blob> => {
    canvas.width = w;
    canvas.height = h;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, w, h);

    // If JPEG, fill crisp white background to prevent black alpha transparent channel
    if (format === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);
    }
    ctx.drawImage(img, 0, 0, w, h);

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (!b) return reject(new Error('Canvas blob generation failed'));
          resolve(b);
        },
        format,
        q
      );
    });
  };

  // CASE 1: No target KB specified OR PNG format without target KB
  if (!targetKb || (format === 'image/png' && !targetKb)) {
    const rawBlob = await renderBlob(targetW, targetH, options.quality ?? 0.85);
    const finalBlob = format === 'image/jpeg' ? await injectJfifDpi(rawBlob, dpi) : rawBlob;
    const dataUrl = URL.createObjectURL(finalBlob);
    return {
      blob: finalBlob,
      dataUrl,
      width: targetW,
      height: targetH,
      sizeKb: Math.round((finalBlob.size / 1024) * 10) / 10,
    };
  }

  // CASE 2: Target KB specified (JPEG, WebP, or downscaled PNG)
  let curWidth = targetW;
  let curHeight = targetH;
  let bestBlob: Blob | null = null;

  if (format === 'image/png') {
    // PNG has no quality compression param in canvas, so we downscale dimensions iteratively until under target KB
    let pBlob = await renderBlob(curWidth, curHeight, 1.0);
    while (pBlob.size / 1024 > targetKb && curWidth > 50 && curHeight > 50) {
      curWidth = Math.round(curWidth * 0.88);
      curHeight = Math.round(curHeight * 0.88);
      pBlob = await renderBlob(curWidth, curHeight, 1.0);
    }
    bestBlob = pBlob;
  } else {
    // JPEG or WebP: Binary search quality
    let lowQ = 0.12;
    let highQ = 0.96;

    for (let step = 0; step < 7; step++) {
      const midQ = (lowQ + highQ) / 2;
      let candidate = await renderBlob(curWidth, curHeight, midQ);
      if (format === 'image/jpeg') {
        candidate = await injectJfifDpi(candidate, dpi);
      }
      const sizeKb = candidate.size / 1024;

      if (sizeKb <= targetKb) {
        bestBlob = candidate;
        lowQ = midQ; // try better quality
      } else {
        highQ = midQ; // too big, decrease quality
      }
    }

    // If even lowest quality is still over target KB, iteratively scale dimensions down
    let scaleAttempts = 0;
    while ((!bestBlob || bestBlob.size / 1024 > targetKb) && scaleAttempts < 6) {
      curWidth = Math.round(curWidth * 0.85);
      curHeight = Math.round(curHeight * 0.85);
      if (curWidth < 60 || curHeight < 60) break;

      let candidate = await renderBlob(curWidth, curHeight, 0.6);
      if (format === 'image/jpeg') {
        candidate = await injectJfifDpi(candidate, dpi);
      }
      bestBlob = candidate;
      scaleAttempts++;
    }
  }

  if (!bestBlob) {
    bestBlob = await renderBlob(curWidth, curHeight, 0.3);
    if (format === 'image/jpeg') {
      bestBlob = await injectJfifDpi(bestBlob, dpi);
    }
  }

  const dataUrl = URL.createObjectURL(bestBlob);
  return {
    blob: bestBlob,
    dataUrl,
    width: curWidth,
    height: curHeight,
    sizeKb: Math.round((bestBlob.size / 1024) * 10) / 10,
  };
}

/**
 * Backward-compatible wrapper for compressImageToTargetKb
 */
export async function compressImageToTargetKb(
  imageSource: HTMLImageElement | File,
  options: ImageProcessOptions
): Promise<CompressResult> {
  return processImageWithControls(imageSource, options);
}

/**
 * Packages multiple processed blobs into a single ZIP file for 1-click batch download
 */
export async function createBatchZip(
  items: Array<{ fileName: string; blob: Blob }>
): Promise<Blob> {
  const zip = new JSZip();
  for (const item of items) {
    zip.file(item.fileName, item.blob);
  }
  return zip.generateAsync({ type: 'blob' });
}

/**
 * Signature Cleaner & Enhancer:
 * Boosts contrast, cleans paper background to pure white, and deepens blue/black ink.
 */
export async function cleanSignature(
  img: HTMLImageElement,
  threshold: number = 210,
  inkDarkness: number = 1.3
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  ctx.drawImage(img, 0, 0);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    if (lum > threshold) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    } else {
      const factor = lum / threshold;
      data[i] = Math.max(0, Math.min(255, Math.round((r * factor) / inkDarkness)));
      data[i + 1] = Math.max(0, Math.min(255, Math.round((g * factor) / inkDarkness)));
      data[i + 2] = Math.max(0, Math.min(255, Math.round((b * factor) / inkDarkness)));
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas;
}

/**
 * Generates a Print Sheet for Passport Photos:
 * 4x6 inch or A4 with cutting guide lines.
 */
export async function generatePassportPrintSheet(
  photoDataUrl: string,
  paperType: '4x6' | 'a4',
  photoWidthMm: number = 35,
  photoHeightMm: number = 45,
  dpi: number = 300,
  copies?: number
): Promise<Blob> {
  const img = await loadImage(photoDataUrl);

  const mmToPx = (mm: number) => Math.round((mm / 25.4) * dpi);
  const paperWidthMm = paperType === '4x6' ? 152.4 : 210;
  const paperHeightMm = paperType === '4x6' ? 101.6 : 297;

  const canvas = document.createElement('canvas');
  canvas.width = mmToPx(paperWidthMm);
  canvas.height = mmToPx(paperHeightMm);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const pWidth = mmToPx(photoWidthMm);
  const pHeight = mmToPx(photoHeightMm);
  const gap = mmToPx(3);
  const marginX = mmToPx(6);
  const marginY = mmToPx(6);

  const cols = Math.floor((canvas.width - 2 * marginX + gap) / (pWidth + gap));
  const rows = Math.floor((canvas.height - 2 * marginY + gap) / (pHeight + gap));
  const maxCopies = cols * rows;
  const count = copies ? Math.min(copies, maxCopies) : maxCopies;

  let placed = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (placed >= count) break;

      const x = marginX + c * (pWidth + gap);
      const y = marginY + r * (pHeight + gap);

      ctx.drawImage(img, x, y, pWidth, pHeight);
      ctx.strokeStyle = '#D1D5DB';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, pWidth, pHeight);

      placed++;
    }
    if (placed >= count) break;
  }

  const rawBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Failed to create sheet blob'))),
      'image/jpeg',
      0.95
    );
  });

  return injectJfifDpi(rawBlob, dpi);
}
