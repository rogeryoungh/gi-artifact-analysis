import { Box } from '../utils/Box';
// Import necessary functions from CanvasUtils (or your PreprocessingUtils)
import * as CanvasUtils from '../utils/CanvasUtils';
import { AsyncWorker } from '../utils/AsyncWorker';

export interface OcrResult {
	box: Box;
	text: string;
}

export class OcrService {
	private detWorker: AsyncWorker<{ imageTensor: Float32Array }, { boxes: Box[] }>;
	private recWorker: AsyncWorker<
		{ inputData: Float32Array; indexToWord: string[] },
		{ text: string }
	>;

	constructor(private indexToWord: string[]) {
		// Initialize workers (assuming URLs are correct)
		this.detWorker = new AsyncWorker(
			new URL('../workers/DetectionWorker.ts', import.meta.url),
			{ type: 'module' }
		);
		this.recWorker = new AsyncWorker(
			new URL('../workers/RecognitionWorker.ts', import.meta.url),
			{ type: 'module' }
		);
	}



	async detectAndRecognize(file: File): Promise<OcrResult[]> {
		const canvas = await CanvasUtils.loadImageToCanvas(file);
		// this.saveCanvasToFile(canvas, 'original.png');

		// 1. Prepare image tensor for DETECTION model (e.g., 640x640)
		// This likely involves resizing the whole image and normalizing differently
		// than the recognition preprocessing. Keep this step as needed for detection.
		const detectionInputTensor = CanvasUtils.getImageTensor(canvas, 640, 640); // Assuming this remains necessary

		// 盒子放大系数
		const BOX_RESIZE = Math.max(canvas.width, canvas.height) / 640;


		// 2. Run Detection
		const { boxes } = await this.detWorker.run({ imageTensor: detectionInputTensor });

		console.log('Detected boxes:', boxes);

		const results: OcrResult[] = [];

		// 3. Process each detected box for RECOGNITION
		for (const box of boxes) {
			console.log('Processing box:', box);
			// Expand the box slightly
			const boxObj = new Box(
				box.x1 * BOX_RESIZE,
				box.y1 * BOX_RESIZE,
				box.x2 * BOX_RESIZE,
				box.y2 * BOX_RESIZE
			);

			// Crop the original canvas using the expanded box
			const cropCanvas = CanvasUtils.cropCanvasRegion(canvas, boxObj);
			console.log('Processing box:', box);

			CanvasUtils.saveCanvasToFile(cropCanvas, `crop_${boxObj.x1}_${boxObj.y1}.png`);
			// alert(`Cropped image saved as crop_${boxObj.x1}_${boxObj.y1}.png`);

			// --- PREPROCESSING FOR RECOGNITION MODEL ---
			// Replace the old CanvasUtils.getCropTensor call
			// Use the detailed preprocessing function we defined
			// This performs: gray->norm(inv)->crop->norm->resize/pad->binarize
			// IMPORTANT: This step runs in the main thread because resizeAndPad uses DOM elements.
			let recognitionInputTensor: Float32Array;
			try {
				recognitionInputTensor = CanvasUtils.preprocessForRecognition(cropCanvas); // Using default threshold 0.6
			} catch (error) {
				console.error("Error during preprocessing for recognition:", error, "Box:", boxObj);
				// Skip this box or handle error appropriately
				continue;
			}
			// --- END PREPROCESSING ---


			// 4. Run Recognition on the preprocessed tensor
			try {
				// Send the specifically preprocessed tensor (384x32) to the worker
				const { text } = await this.recWorker.run({
					inputData: recognitionInputTensor, // Use the preprocessed data
					indexToWord: this.indexToWord,
				});
				results.push({ box: boxObj, text }); // Store result with the expanded box
				console.log('Recognition result:', text);
			} catch (recError) {
				console.error("Error during recognition worker execution:", recError, "Box:", boxObj);
				// Skip this box or handle error appropriately
				continue;
			}

		} // End loop through boxes

		return results;
	}
}
