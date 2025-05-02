import { Box } from '../utils/Box';
import { DetectionAsync } from '../inferences/DetectionWarpper';
import { RecognitionAsync } from '../inferences/RecognitionWarpper';
import { saveOffscreenCanvas } from '../utils/CanvasUtils';

export interface OcrResult {
	box: Box;
	text: string;
}

export class OcrService {
	private detWorker: DetectionAsync;
	private recWorker: RecognitionAsync;

	constructor() {
		this.detWorker = new DetectionAsync();
		this.recWorker = new RecognitionAsync();
	}

	async init() {
		await this.detWorker.init();
		await this.recWorker.init();
	}


	async detectAndRecognize(file: File): Promise<OcrResult[]> {
		// 1. 获得图片
		const image = await createImageBitmap(file);
		console.log("1. Image preprocessed for detection");

		// 2. 文本检测
		const boxes = await this.detWorker.detect(image);
		console.log("2. Detection completed, boxes detected:", boxes);

		const results: OcrResult[] = [];

		// 3. Process each detected box for RECOGNITION
		for (const box of boxes) {
			// 3.1 裁剪图片
			const boxObj = new Box(box[0], box[1], box[2], box[3]);
			const cropCanvas = new OffscreenCanvas(boxObj.x2 - boxObj.x1, boxObj.y2 - boxObj.y1);
			const ctx = cropCanvas.getContext('2d')!;
			ctx.drawImage(image, boxObj.x1, boxObj.y1, boxObj.x2 - boxObj.x1, boxObj.y2 - boxObj.y1, 0, 0, boxObj.x2 - boxObj.x1, boxObj.y2 - boxObj.y1);
			console.log("3.1 Cropped image from original image, box:", boxObj);

			// 3.2 处理裁剪后的图片
			const cropImage = cropCanvas.transferToImageBitmap();
			const text = await this.recWorker.recognition(cropImage);
			console.log("3.2 Recognition completed, text detected:", text);

			results.push({
				box: boxObj,
				text: text,
			});
		} // End loop through boxes

		console.log("6. All boxes processed, results:", results);
		return results;
	}
}
