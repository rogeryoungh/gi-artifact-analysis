export class AsyncWorker<T, R> {
  private worker: Worker;

  constructor(path: string | URL, options?: WorkerOptions) {
    this.worker = new Worker(path, options);
  }

  run(data: T): Promise<R> {
    return new Promise((resolve, reject) => {
      const handleMessage = (e: MessageEvent<R>) => {
        this.worker.removeEventListener('message', handleMessage);
        resolve(e.data);
      };
      const handleError = (e: ErrorEvent) => {
        this.worker.removeEventListener('error', handleError);
        reject(e.error || new Error(e.message));
      };
      this.worker.addEventListener('message', handleMessage);
      this.worker.addEventListener('error', handleError);
      this.worker.postMessage(data);
    });
  }
}
