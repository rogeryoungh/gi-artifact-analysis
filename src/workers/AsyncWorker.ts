import type { WorkerRequest, WorkerResponse } from "./WorkersTypes";

export class AsyncWorker {
  private worker: Worker;
  private nextId = 1;
  private handlers = new Map<
    number,
    { resolve: (value: any) => void; reject: (err: any) => void }
  >();

  constructor(worker: Worker) {
    this.worker = worker;
    this.worker.onmessage = this.onMessage.bind(this);
  }

  private onMessage(ev: MessageEvent<WorkerResponse<any>>) {
    const { id, result, error } = ev.data;
    const h = this.handlers.get(id);
    if (!h) return;
    if (error) h.reject(new Error(error));
    else h.resolve(result);
    this.handlers.delete(id);
  }

  call(method: string, params: any): Promise<any> {
    const id = this.nextId++;
    const payload: WorkerRequest<any> = { id, method, params };
    return new Promise((resolve, reject) => {
      this.handlers.set(id, { resolve, reject });
      this.worker.postMessage(payload);
    });
  }

  terminate() {
    this.worker.terminate();
    this.handlers.clear();
  }
}
