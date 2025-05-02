import { InferenceSession, Tensor } from 'onnxruntime-web';
import { dbPostProcess } from '../utils/DBPostprocess';

const TARGET_W = 640;
const TARGET_H = 640;
const DET_INPUT_SIZE = [3, TARGET_H, TARGET_W] as const; // 640x640
const DET_MODEL_PATH = '/ch_PP-OCRv4_det_infer.onnx';


export async function initModel() {
	return await InferenceSession.create(DET_MODEL_PATH);
}


function getScaler(width: number, height: number): number {
	return Math.min(TARGET_W / width, TARGET_H / height);
}

function preprocess(image: ImageBitmap): Float32Array {
	// 1. 缩放到 640x640
	const { width, height } = image;
	const canvas = new OffscreenCanvas(TARGET_W, TARGET_H);
	const ctx = canvas.getContext('2d')!;
	const scale = getScaler(width, height);
	const newW = Math.floor(width * scale);
	const newH = Math.floor(height * scale);

	ctx.fillRect(0, 0, TARGET_W, TARGET_H);
	ctx.drawImage(image, 0, 0, newW, newH);

	// 2. 获取图像数据
	const resizedData = ctx.getImageData(0, 0, TARGET_W, TARGET_H).data;

	// 3. 转换为 Float32Array
	const WH = TARGET_W * TARGET_H;
	const arr = new Float32Array(WH * 3);
	for (let i = 0; i < WH; i++) {
		arr[i] = resizedData[i * 4] / 255.0; // R
		arr[i + WH] = resizedData[i * 4 + 1] / 255.0; // G
		arr[i + WH * 2] = resizedData[i * 4 + 2] / 255.0; // B
	}
	return arr;
}

async function detectionInference(detSession: InferenceSession, imageF32: Float32Array):
	Promise<Float32Array> {
	const [c, h, w] = DET_INPUT_SIZE;
	const inputName = detSession.inputNames[0];
	const tensor = new Tensor('float32', imageF32, [1, c, h, w]);
	const outputMap = await detSession.run({ [inputName]: tensor });
	const ret = outputMap[detSession.outputNames[0]].data as Float32Array;
	return ret;
}

function postprocess(
	probArray: Float32Array,
	width: number,
	height: number
): number[][] {
	const boxes = dbPostProcess(probArray, TARGET_W, TARGET_H);
	const scaler = getScaler(width, height);
	const scaledBoxes = boxes.map(({ x1, y1, x2, y2 }) => {
		return [x1 / scaler, y1 / scaler, x2 / scaler, y2 / scaler];
	});
	return scaledBoxes;
}


export async function detection(detSession: InferenceSession, imageBitmap: ImageBitmap) {
	const { width, height } = imageBitmap;
	console.log("Received imageBitmap, Width:", width, "Height:", height);
	const imageF32 = preprocess(imageBitmap);
	console.log("Preprocessed image to Float32Array of size:", imageF32.length);
	const boxes = await detectionInference(detSession, imageF32);
	console.log('Detected boxes:', boxes);
	const finalBoxes = postprocess(boxes, width, height);
	console.log('Postprocessed boxes:', finalBoxes);
	return finalBoxes;
}
