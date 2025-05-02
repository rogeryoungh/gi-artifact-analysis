import type { WorkerRequest } from "./WorkersTypes";
import { initModel, detection } from "../inferences/DetectionCore";
import type { InferenceSession } from "onnxruntime-web";

let model: InferenceSession | null = null;

self.onmessage = async (e: MessageEvent<WorkerRequest<any>>) => {
  const { id, method, params } = e.data;
  let result: any;
  if (method === "init") {
    model = await initModel();
    result = "Successfully initialized model";
  } else {
    result = await detection(model!, params);
  }
  self.postMessage({ id, result });
};
