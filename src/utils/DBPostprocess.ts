import cv from '@techstark/opencv-js';
import { Box } from './Box';

// DBNet 后处理，从概率图中提取文本框
// https://github.com/RapidAI/RapidOCR/blob/main/python/rapidocr/ch_ppocr_det/utils.py#L119
export function dbPostProcess(
	probArray: Float32Array,
	width: number,
	height: number,
	binaryThreshold: number = 0.3,
	minBoxArea: number = 10,
): Box[] {
	let src: cv.Mat | null = null;
	let binaryMat: cv.Mat | null = null;
	let contours: cv.MatVector | null = null;
	let hierarchy: cv.Mat | null = null;
	const resultBoxes: Box[] = [];

	try {
		// 1. 创建 Mat 对象，并转换到 f32(0,1) 到 u8(0,255)
		let probMat32F = cv.matFromArray(height, width, cv.CV_32FC1, probArray);
		src = new cv.Mat(height, width, cv.CV_8UC1);
		probMat32F.convertTo(src, cv.CV_8UC1, 255.0);
		probMat32F.delete();

		// 2. 二值化处理
		binaryMat = new cv.Mat();
		const thresholdValue = binaryThreshold * 255;
		cv.threshold(src, binaryMat, thresholdValue, 255, cv.THRESH_BINARY);

		// 3. 寻找轮廓
		contours = new cv.MatVector();
		hierarchy = new cv.Mat();
		cv.findContours(binaryMat, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);

		for (let i = 0; i < contours.size(); ++i) {
			// 4. 计算轮廓的面积和周长
			const contour = contours.get(i);
			const area = cv.contourArea(contour);
			const perimeter = cv.arcLength(contour, true);

			// 5. 按照面积过滤轮廓
			if (area < minBoxArea) {
				contour.delete();
				continue;
			}
			// 6. 计算轮廓的边界矩形
			const rect = cv.boundingRect(contour);

			// 7. 创建 Box 并按照面积和周长扩展
			let box = new Box(rect.x, rect.y, rect.x + rect.width, rect.y + rect.height);
			box = box.expand(area, perimeter, 2, width, height);
			if (box.x2 > box.x1 && box.y2 > box.y1) {
				resultBoxes.push(box);
			}
			contour.delete();
		}

	} catch (error) {
		console.error("Error during dbPostProcess:", error);
		throw error;
	} finally {
		// 8. Clean up all allocated OpenCV Mats
		src?.delete();
		binaryMat?.delete();
		contours?.delete();
		hierarchy?.delete();
	}

	return resultBoxes;
}
