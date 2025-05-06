import { Box } from './Box';
import { bfsFindContours, contourArea, contourPerimeter, boundingBox } from './FindContours';

// DBNet 后处理，从概率图中提取文本框
// https://github.com/RapidAI/RapidOCR/blob/main/python/rapidocr/ch_ppocr_det/utils.py#L119
export function dbPostProcess(
  probArray: Float32Array,
  width: number,
  height: number,
  binaryThreshold = 0.3,
  minBoxArea = 10,
): Box[] {

  // 1. 概率图 -> 二值图
  const thresh = binaryThreshold * 255;
  const binary = new Uint8Array(width * height);
  for (let i = 0; i < probArray.length; i++) {
    binary[i] = probArray[i] * 255 > thresh ? 255 : 0;
  }

  // 2. 轮廓提取
  const contours = bfsFindContours(binary, width, height);

  // 3. 过滤 + 生成 Box
  const boxes: Box[] = [];
  for (const c of contours) {
    const area = contourArea(c);
    if (area < minBoxArea) continue;

    const perimeter = contourPerimeter(c);
    let box = boundingBox(c);
    box = box.expand(area, perimeter, 2, width, height);
    if (box.x2 > box.x1 && box.y2 > box.y1) boxes.push(box);
  }
  return boxes;
}
