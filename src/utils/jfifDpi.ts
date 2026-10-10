/**
 * Injects or updates JFIF APP0 density bytes into a JPEG Blob to guarantee exact DPI.
 * Standard JFIF APP0 layout:
 * [0xFF, 0xD8] (SOI)
 * [0xFF, 0xE0] (APP0 marker)
 * [length MSB, length LSB] (usually 16: 0x00, 0x10)
 * 'JFIF\0' (0x4A, 0x46, 0x49, 0x46, 0x00)
 * [major, minor] (0x01, 0x02)
 * [units] (0x01 = DPI)
 * [Xdensity MSB, Xdensity LSB]
 * [Ydensity MSB, Ydensity LSB]
 * [Xthumb, Ythumb] (0x00, 0x00)
 */
export async function injectJfifDpi(blob: Blob, dpi: number = 300): Promise<Blob> {
  if (!blob.type.includes('jpeg') && !blob.type.includes('jpg')) {
    return blob; // Only JPEG supports JFIF marker
  }

  const arrayBuffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  // Check JPEG SOI marker (0xFF, 0xD8)
  if (bytes.length < 4 || bytes[0] !== 0xFF || bytes[1] !== 0xD8) {
    return blob;
  }

  const roundedDpi = Math.max(1, Math.min(2400, Math.round(dpi)));
  const dpiMsb = (roundedDpi >> 8) & 0xFF;
  const dpiLsb = roundedDpi & 0xFF;

  // Check if first marker after SOI is APP0 (0xFF, 0xE0)
  if (bytes[2] === 0xFF && bytes[3] === 0xE0) {
    const markerLen = (bytes[4] << 8) | bytes[5];
    // Check for 'JFIF\0' identifier (ASCII 74, 70, 73, 70, 0)
    if (
      bytes[6] === 0x4A &&
      bytes[7] === 0x46 &&
      bytes[8] === 0x49 &&
      bytes[9] === 0x46 &&
      bytes[10] === 0x00
    ) {
      // Patch density in-place
      const modified = new Uint8Array(bytes);
      modified[11] = 0x01; // Units: 1 = Dots per Inch
      modified[12] = dpiMsb;
      modified[13] = dpiLsb;
      modified[14] = dpiMsb;
      modified[15] = dpiLsb;
      return new Blob([modified], { type: 'image/jpeg' });
    }
  }

  // If no JFIF APP0 marker exists, insert standard 18-byte JFIF APP0 block right after SOI
  const app0 = new Uint8Array([
    0xFF, 0xE0, // APP0 marker
    0x00, 0x10, // length = 16
    0x4A, 0x46, 0x49, 0x46, 0x00, // 'JFIF\0'
    0x01, 0x02, // version 1.02
    0x01,       // units: 1 = dots per inch
    dpiMsb, dpiLsb, // X density
    dpiMsb, dpiLsb, // Y density
    0x00, 0x00  // thumbnails
  ]);

  const output = new Uint8Array(bytes.length + app0.length);
  output.set(bytes.subarray(0, 2), 0); // SOI
  output.set(app0, 2);                 // APP0
  output.set(bytes.subarray(2), 2 + app0.length); // Remaining bytes

  return new Blob([output], { type: 'image/jpeg' });
}
