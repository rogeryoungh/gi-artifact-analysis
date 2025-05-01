import { InferenceSession, Tensor } from 'onnxruntime-web';
let recSession: InferenceSession | null = null;
const REC_MODEL_PATH = '/yas.onnx';

// 相同预处理函数，简化版
function preProcess(arr: Float32Array): Float32Array {
  // 假设 arr 已经是 [384*32] 大小的灰度值
  // 二值化
  const out = new Float32Array(arr.length);
  for (let i = 0; i < arr.length; i++) {
    out[i] = arr[i] < 0.6 ? 0 : 1;
  }
  return out;
}

self.onmessage = async (
  e: MessageEvent<{ inputData: Float32Array; indexToWord: string[] }>
) => {
  const { inputData, indexToWord } = e.data;
  if (!recSession) {
    recSession = await InferenceSession.create(REC_MODEL_PATH);
  }
  const tensor = new Tensor('float32', preProcess(inputData), [1, 1, 32, 384]);
  const outputMap = await recSession.run({ [recSession.inputNames[0]]: tensor });
  const out = outputMap[recSession.outputNames[0]].data as Float32Array;
  const [seqLen, , numClasses] = outputMap[recSession.outputNames[0]].dims;
  let ans = '';
  let last = '';
  for (let i = 0; i < seqLen; i++) {
    let maxIdx = 0;
    let maxVal = -Infinity;
    for (let j = 0; j < numClasses; j++) {
      const v = out[i * numClasses + j];
      if (v > maxVal) {
        maxVal = v;
        maxIdx = j;
      }
    }
    const w = indexToWord[maxIdx];
    if (w !== last && w !== '-') {
      ans += w;
    }
    last = w;
  }
  self.postMessage({ text: ans });
};
