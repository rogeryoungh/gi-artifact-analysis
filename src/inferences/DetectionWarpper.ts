import { AsyncWorker } from "../workers/AsyncWorker";
import { detection, initModel } from "./DetectionCore";
import type { InferenceSession } from "onnxruntime-web";

export class DetectionWorker {
	private worker: AsyncWorker;

	constructor() {
		this.worker = new AsyncWorker("../workers/DetectionWorker.ts");
	}

	async init() {
		await this.worker.call("init", null);
	}

	async detect(image: ImageBitmap): Promise<number[][]> {
		return this.worker.call("detect", image);
	}

	terminate() {
		this.worker.terminate();
	}
}

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
