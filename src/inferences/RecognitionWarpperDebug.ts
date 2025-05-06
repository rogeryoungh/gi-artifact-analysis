import { recognition, initModel, initWordIndex } from "./RecognitionCore";
import type { InferenceSession } from "onnxruntime-web";

export class RecognitionWorker {
	private model: InferenceSession | null = null;
	private wordIndex: string[] | null = null;


	async init() {
		this.model = await initModel();
		this.wordIndex = await initWordIndex();
	}

	async recognition(image: ImageBitmap): Promise<string> {
		const boxes = await recognition(this.model!, this.wordIndex!, image);
		return boxes;
	}
}
