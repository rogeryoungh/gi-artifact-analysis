import type { WorkerRequest } from "./WorkersTypes";
import { initModel, initWordIndex, recognition } from "../inferences/RecognitionCore";
import type { InferenceSession } from "onnxruntime-web";

let model: InferenceSession | null = null;
let wordIndex: string[] | null = null;

self.onmessage = async (e: MessageEvent<WorkerRequest<any>>) => {
  const { id, method, params } = e.data;
  let result: any;
  if (method === "init") {
    model = await initModel();
    wordIndex = await initWordIndex();
    result = "Successfully initialized model";
  } else {
    result = await recognition(model!, wordIndex!, params);
  }
  self.postMessage({ id, result });
};
