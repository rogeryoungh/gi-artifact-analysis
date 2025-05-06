import { Box } from '../utils/Box';
import { DetectionWorker } from '../inferences/DetectionWarpper';
import { RecognitionWorker } from '../inferences/RecognitionWarpper';

export interface OcrResult {
	box: Box;
	text: string;
}

export class OcrService {
	private detWorker: DetectionWorker;
	private recWorker: RecognitionWorker;

	constructor() {
		this.detWorker = new DetectionWorker();
		this.recWorker = new RecognitionWorker();
	}

	async init() {
		await Promise.all([
			this.detWorker.init(),
			this.recWorker.init(),
		]);
	}


	async detectAndRecognize(file: File): Promise<OcrResult[]> {
		// 1. 获得图片
		const image = await createImageBitmap(file);

		// 2. 文本检测
		const boxes = await this.detWorker.detect(image);
		const results: OcrResult[] = [];

		// 3. Process each detected box for RECOGNITION
		for (const box of boxes) {
			// 3.1 裁剪图片
			const boxObj = new Box(box[0], box[1], box[2], box[3]);
			const cropCanvas = new OffscreenCanvas(boxObj.x2 - boxObj.x1, boxObj.y2 - boxObj.y1);
			const ctx = cropCanvas.getContext('2d')!;
			ctx.drawImage(image, boxObj.x1, boxObj.y1, boxObj.x2 - boxObj.x1, boxObj.y2 - boxObj.y1, 0, 0, boxObj.x2 - boxObj.x1, boxObj.y2 - boxObj.y1);

			// 3.2 处理裁剪后的图片
			const cropImage = cropCanvas.transferToImageBitmap();
			const text = await this.recWorker.recognition(cropImage);

			results.push({ box: boxObj, text: text, });
		}

		return results;
	}
}
