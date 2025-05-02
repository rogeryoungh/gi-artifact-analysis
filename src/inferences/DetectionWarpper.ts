import { AsyncWorker } from "../workers/AsyncWorker";
import MyDetWorker from "../workers/DetectionWorker?worker";

export class DetectionWorker {
	private worker: AsyncWorker;

	constructor() {
		this.worker = new AsyncWorker(new MyDetWorker());
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
