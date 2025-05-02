import { AsyncWorker } from "../workers/AsyncWorker";
import MyRecWorker from "../workers/RecognitionWorker?worker";

export class RecognitionWorker {
	private worker: AsyncWorker;

	constructor() {
		this.worker = new AsyncWorker(new MyRecWorker());
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
