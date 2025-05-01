import { InferenceSession, Tensor } from 'onnxruntime-web';
import { dbPostProcess } from '../utils/DBPostprocess';

let detSession: InferenceSession | null = null;
const DET_MODEL_PATH = '/ch_PP-OCRv4_det_infer.onnx';
const DET_INPUT_SIZE = [3, 640, 640] as const;

self.onmessage = async (e: MessageEvent<{ imageTensor: Float32Array }>) => {
  const { imageTensor } = e.data;
  if (!detSession) {
    detSession = await InferenceSession.create(DET_MODEL_PATH);
  }
  const [c, h, w] = DET_INPUT_SIZE;
  console.log('Input tensor shape:', [1, c, h, w]);
  const inputName = detSession.inputNames[0];
  const tensor = new Tensor('float32', imageTensor, [1, c, h, w]);
  const outputMap = await detSession.run({ [inputName]: tensor });
  const probMap = outputMap[detSession.outputNames[0]].data as Float32Array;
  // 使用 DB 后处理算法
  const boxes = dbPostProcess(
    probMap,
    w,
    h,
  );
  console.log('Detected boxes:', boxes);
  self.postMessage({ boxes });
};
