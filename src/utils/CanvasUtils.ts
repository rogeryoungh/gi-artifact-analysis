import { Box } from './Box';

/**
 * 将 File 转为 Canvas
 */
export async function loadImageToCanvas(file: File): Promise<HTMLCanvasElement> {
  const img = new Image();
  img.src = URL.createObjectURL(file);
  await new Promise<void>(r => (img.onload = () => r()));
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);
  return canvas;
}

/**
 * 按检测模型要求生成输入Tensor: resize到 [w,h] 并 CHW 归一化
 */
export function getImageTensor(
  canvas: HTMLCanvasElement,
  targetW: number,
  targetH: number
): Float32Array {
  const tmp = document.createElement('canvas');
  tmp.width = targetW;
  tmp.height = targetH;
  const ctx = tmp.getContext('2d')!;
  const scale = Math.min(
    targetW / canvas.width,
    targetH / canvas.height
  );
  const newW = Math.floor(canvas.width * scale);
  const newH = Math.floor(canvas.height * scale);
  ctx.fillRect(0, 0, targetW, targetH);
  ctx.drawImage(canvas, 0, 0, newW, newH);
  saveCanvasToFile(tmp, 'tmp.png'); // Debugging line
  const { data } = ctx.getImageData(0, 0, targetW, targetH);
  const arr = new Float32Array(3 * targetH * targetW);
  let ptr = 0;
  for (let c = 0; c < 3; c++) {
    for (let i = c; i < data.length; i += 4) {
      arr[ptr++] = data[i] / 255;
    }
  }
  tmp.remove();
  return arr;
}

export function saveCanvasToFile(canvas: HTMLCanvasElement, filename: string): void {
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 裁剪 Canvas 上的 box 区域为新 Canvas
 */
export function cropCanvasRegion(
  canvas: HTMLCanvasElement,
  box: Box
): HTMLCanvasElement {
  const w = box.x2 - box.x1;
  const h = box.y2 - box.y1;
  const tmp = document.createElement('canvas');
  tmp.width = w;
  tmp.height = h;
  const ctx = tmp.getContext('2d')!;
  ctx.drawImage(
    canvas,
    box.x1,
    box.y1,
    w,
    h,
    0,
    0,
    w,
    h
  );
  return tmp;
}

/**
 * 将裁剪后的 Canvas 转为识别模型输入 Tensor ([1,1,32,384])
 */
export function getCropTensor(
  cropCanvas: HTMLCanvasElement
): Float32Array {
  const w = cropCanvas.width;
  const h = cropCanvas.height;
  const targetW = 384;
  const targetH = 32;
  const scale = targetH / h;
  let newW = Math.floor(w * scale);
  if (newW > targetW) newW = targetW;
  const tmp = document.createElement('canvas');
  tmp.width = targetW;
  tmp.height = targetH;
  const ctx = tmp.getContext('2d')!;
  ctx.fillRect(0, 0, targetW, targetH);
  ctx.drawImage(
    cropCanvas,
    0,
    0,
    w,
    h,
    0,
    0,
    newW,
    targetH
  );
  const imgData = ctx.getImageData(0, 0, targetW, targetH).data;
  const arr = new Float32Array(targetW * targetH);
  for (let i = 0; i < targetW * targetH; i++) {
    arr[i] = imgData[i * 4] / 255;
  }
  return arr;
}

export function toGray(data: ImageData, w: number, h: number): Float32Array {
  const gray = new Float32Array(w * h);
  const d = data.data;
  for (let i = 0; i < w * h; i++) {
    // Standard luminance calculation
    const r = d[i * 4] / 255;
    const g = d[i * 4 + 1] / 255;
    const b = d[i * 4 + 2] / 255;
    gray[i] = 0.2989 * r + 0.5870 * g + 0.1140 * b;
  }
  return gray;
}

/**
 * Normalizes a Float32Array to the 0-1 range.
 * Optionally inverts the image based on the bottom-right pixel brightness.
 */
export function normalize(
  arr: Float32Array,
  w: number,
  h: number,
  autoInverse: boolean
): Float32Array {
  const len = w * h;
  let min = Infinity, max = -Infinity;
  for (let i = 0; i < len; i++) {
    const v = arr[i];
    if (v < min) min = v;
    if (v > max) max = v;
  }

  // Handle flat images (all pixels the same value)
  if (max === min) {
    // Return an array of 0s if the value is >= 0.5 (likely background)
    // or 1s if the value is < 0.5 (likely dark text on light bg assumed)
    // after potential inversion logic would apply. Or just return 0s.
    // Let's default to 0s representing background.
    return new Float32Array(len).fill(0);
    // Or: return arr.slice(); // If you want to keep the constant value
  }

  // Determine if inversion is needed based on bottom-right corner
  const flagIdx = (h - 1) * w + (w - 1);
  // Ensure flagIdx is within bounds, especially for 1x1 images after crop
  const safeFlagIdx = Math.max(0, Math.min(len - 1, flagIdx));
  const flag = (arr[safeFlagIdx] - min) / (max - min); // Normalized value of corner pixel

  const out = new Float32Array(len);
  const range = max - min;
  const shouldInverse = autoInverse && flag > 0.5; // Inverse if corner is light

  for (let i = 0; i < len; i++) {
    let v = (arr[i] - min) / range;
    if (shouldInverse) v = 1 - v; // Apply inversion
    out[i] = v;
  }
  return out;
}

/**
 * Crops the image based on pixel values exceeding a tolerance.
 * Finds the bounding box of pixels > tol.
 */
export function crop(
  arr: Float32Array,
  w: number,
  h: number,
  tol: number = 0.7 // Tolerance from old code
): { data: Float32Array; width: number; height: number } {
  let minCol = w, maxCol = -1, minRow = h, maxRow = -1; // Use -1 to handle finding first pixel correctly

  // Find min/max columns containing values > tol
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      if (arr[y * w + x] > tol) {
        if (x < minCol) minCol = x;
        if (x > maxCol) maxCol = x;
        // Optimization: If we found a pixel in this column,
        // no need to check other rows for *this specific* column boundary check.
        // break; // Careful: this breaks the inner loop (y), might miss maxCol if it's lower in the same column
      }
    }
  }

  // Find min/max rows containing values > tol
  for (let y = 0; y < h; y++) {
    for (let x = minCol; x <= maxCol; x++) { // Only scan within potential columns
      if (arr[y * w + x] > tol) {
        if (y < minRow) minRow = y;
        if (y > maxRow) maxRow = y;
        // Optimization: If we found a pixel in this row,
        // no need to check other columns for *this specific* row boundary check.
        break;
      }
    }
  }

  // Check if any content was found
  if (maxCol < minCol || maxRow < minRow) {
    // Return original data if no content above tolerance found or box is invalid
    console.warn("Crop found no content above tolerance, returning original.");
    return { data: arr.slice(), width: w, height: h };
  }

  const cw = maxCol - minCol + 1;
  const ch = maxRow - minRow + 1;
  const out = new Float32Array(cw * ch);
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      // Calculate source index carefully
      const sourceY = minRow + y;
      const sourceX = minCol + x;
      out[y * cw + x] = arr[sourceY * w + sourceX];
    }
  }
  return { data: out, width: cw, height: ch };
}

/**
 * Resizes the input array (representing a grayscale image) to a target height
 * while maintaining aspect ratio, then pads/crops the width to a target width.
 * Uses intermediate canvases for scaling.
 * NOTE: This function requires access to the DOM (`document.createElement`).
 * It cannot run in a standard Web Worker without OffscreenCanvas support.
 */
export function resizeAndPad(
  arr: Float32Array,
  w: number,
  h: number,
  targetW: number = 384, // Target dimensions from old code
  targetH: number = 32
): { data: Float32Array; width: number; height: number } {
  if (h <= 0 || w <= 0) {
    console.warn("ResizeAndPad received zero or negative dimensions, returning empty.");
    // Return a black image of target size
    return { data: new Float32Array(targetW * targetH).fill(0), width: targetW, height: targetH };
  }
  const scale = targetH / h;
  let newW = Math.round(w * scale); // Use Math.round for potentially better results
  const newH = targetH;

  // Prevent newW from becoming zero if scale is very small
  newW = Math.max(1, newW);

  // Clamp width if it exceeds target width after scaling
  if (newW > targetW) {
    console.warn(`Scaled width ${newW} exceeds target ${targetW}, clamping.`);
    newW = targetW;
  }


  // Create a temporary canvas for the source grayscale array
  const srcCanvas = document.createElement('canvas');
  srcCanvas.width = w;
  srcCanvas.height = h;
  const sCtx = srcCanvas.getContext('2d', { alpha: false }); // No alpha needed
  if (!sCtx) throw new Error('Failed to get 2D context for source canvas');

  const srcImg = sCtx.createImageData(w, h);
  const srcData = srcImg.data;
  for (let i = 0; i < w * h; i++) {
    const v = Math.round(arr[i] * 255); // Convert normalized (0-1) back to grayscale (0-255)
    srcData[i * 4] = v;     // R
    srcData[i * 4 + 1] = v; // G
    srcData[i * 4 + 2] = v; // B
    srcData[i * 4 + 3] = 255; // Alpha (fully opaque)
  }
  sCtx.putImageData(srcImg, 0, 0);

  // Create a canvas for scaling
  const scaleCanvas = document.createElement('canvas');
  scaleCanvas.width = newW;
  scaleCanvas.height = newH;
  const scCtx = scaleCanvas.getContext('2d', { alpha: false });
  if (!scCtx) throw new Error('Failed to get 2D context for scaling canvas');
  // Use imageSmoothingEnabled for potentially better scaling quality (browser default varies)
  // scCtx.imageSmoothingEnabled = true; // or false depending on desired sharpness
  scCtx.drawImage(srcCanvas, 0, 0, w, h, 0, 0, newW, newH); // Scale the image

  // Create the target canvas for padding
  const tgtCanvas = document.createElement('canvas');
  tgtCanvas.width = targetW;
  tgtCanvas.height = targetH;
  const tCtx = tgtCanvas.getContext('2d', { alpha: false });
  if (!tCtx) throw new Error('Failed to get 2D context for target canvas');

  // Fill with black (value 0) by default - assuming black background padding
  tCtx.fillStyle = 'black';
  tCtx.fillRect(0, 0, targetW, targetH);

  // Draw the scaled image onto the target canvas (at top-left)
  tCtx.drawImage(scaleCanvas, 0, 0);

  // Get the final image data and convert back to Float32Array (normalized 0-1)
  const outImg = tCtx.getImageData(0, 0, targetW, targetH);
  const outData = outImg.data;
  const out = new Float32Array(targetW * targetH);
  for (let i = 0; i < targetW * targetH; i++) {
    // Read the Red channel (since it's grayscale, R=G=B)
    out[i] = outData[i * 4] / 255;
  }

  return { data: out, width: targetW, height: targetH };
}

// ... other existing CanvasUtils like loadImageToCanvas, cropCanvasRegion, getImageTensor ...

/**
 * Applies the full preprocessing pipeline for the Recognition model.
 * Converts canvas region -> Grayscale -> Normalize(Inv) -> Crop -> Normalize -> Resize/Pad -> Binarize.
 * NOTE: Uses DOM elements for resizing, must run in main thread or compatible worker.
 * @param canvas The input canvas (already cropped by detection).
 * @param thr Binarization threshold (0-1). Default 0.6 from old code.
 * @returns Float32Array (384x32) ready for recognition model.
 */
export function preprocessForRecognition(canvas: HTMLCanvasElement, thr: number = 0.6): Float32Array {
  const w = canvas.width;
  const h = canvas.height;
  if (w <= 0 || h <= 0) {
    console.warn("preprocessForRecognition received zero-sized canvas, returning empty tensor.");
    // Return a tensor matching the expected output size, filled with 0 (background)
    return new Float32Array(384 * 32).fill(0);
  }


  // Get ImageData from the input canvas
  const ctx = canvas.getContext('2d', { willReadFrequently: true }); // Optimization hint
  if (!ctx) throw new Error('Failed to get 2D context for preprocessing');
  const imageData = ctx.getImageData(0, 0, w, h);

  // --- Apply the sequence from the old `preProcess` function ---

  // 1. Grayscale
  let gray = toGray(imageData, w, h);

  // 2. Normalize + Optional AutoInverse (based on original image corner)
  // Note: Applying auto-inverse based on a small cropped canvas corner might
  // not be as reliable as on the full image. Consider if this step is still desired.
  // Keeping it for consistency with the old code for now.
  gray = normalize(gray, w, h, true); // autoInverse = true

  // 3. Crop tightly around the content *within the already cropped canvas*
  // This refines the detection box based on pixel intensity.
  const { data: cropped, width: cw, height: ch } = crop(gray, w, h); // Uses default tol=0.7

  if (cw <= 0 || ch <= 0) {
    console.warn("Preprocessing crop step resulted in zero dimensions, returning empty tensor.");
    return new Float32Array(384 * 32).fill(0);
  }

  // 4. Normalize the *tightly cropped* data (no auto-inverse)
  const normCrop = normalize(cropped, cw, ch, false); // autoInverse = false

  // 5. Resize height to 32, pad/crop width to 384
  // This step uses canvas elements internally via resizeAndPad.
  const { data: padded } = resizeAndPad(normCrop, cw, ch); // Uses targetW=384, targetH=32

  // 6. Binarize the final 384x32 image
  const out = new Float32Array(384 * 32);
  for (let i = 0; i < 384 * 32; i++) {
    // Pixels below threshold become 0 (background), above/equal become 1 (foreground)
    out[i] = padded[i] < thr ? 0 : 1;
  }

  return out;
}
