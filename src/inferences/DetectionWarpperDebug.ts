import { detection, initModel } from "./DetectionCore";
import type { InferenceSession } from "onnxruntime-web";

export class DetectionAsync {
	private model: InferenceSession | null = null;

	async init() {
		this.model = await initModel();
	}

	async detect(image: ImageBitmap): Promise<number[][]> {
		const boxes = await detection(this.model!, image);
		return boxes;
	}
}
