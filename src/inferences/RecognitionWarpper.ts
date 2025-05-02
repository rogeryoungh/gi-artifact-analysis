import { AsyncWorker } from "../workers/AsyncWorker";
import { recognition, initModel, initWordIndex } from "./RecognitionCore";
import type { InferenceSession } from "onnxruntime-web";

export class RecognitionWorker {
	private worker: AsyncWorker;

	constructor() {
		this.worker = new AsyncWorker("../workers/RecognitionWorker.ts");
	}

	async init() {
		await this.worker.call("init", null);
	}

	async recognition(image: ImageBitmap): Promise<string> {
		return this.worker.call("recognition", image);
	}

	terminate() {
		this.worker.terminate();
	}
}

export class RecognitionAsync {
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
