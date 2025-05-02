import { InferenceSession, Tensor } from "onnxruntime-web";
import { saveOffscreenCanvas } from "../utils/CanvasUtils";

const TARGET_W = 384;
const TARGET_H = 32;
const NUM_CLASSES = 617;
const REC_MODEL_PATH = "/yas.onnx";

export async function initModel() {
	return await InferenceSession.create(REC_MODEL_PATH);
}

export async function initWordIndex(): Promise<string[]> {
	const response = await fetch("/indexToWord.json");
	const data = await response.json();
	return Object.values(data);
}

function RGB2Gray(r: number, g: number, b: number): number {
	return 0.2989 * r + 0.5870 * g + 0.1140 * b;
}

function toGray(data: ImageData): Float32Array {
	const { width, height } = data;
	const gray = new Float32Array(width * height);
	const d = data.data;
	for (let i = 0; i < gray.length; i++) {
		// Standard luminance calculation
		const r = d[i * 4] / 255;
		const g = d[i * 4 + 1] / 255;
		const b = d[i * 4 + 2] / 255;
		gray[i] = RGB2Gray(r, g, b);
	}
	return gray;
}

function getNormInfo(arr: Float32Array): { min: number; max: number, shouldInverse: boolean } {
	let min = Infinity, max = -Infinity;
	arr.forEach((v) => {
		if (v < min) min = v;
		if (v > max) max = v;
	});
	const flag = (arr[arr.length - 1] - min) / (max - min);
	const shouldInverse = flag > 0.5;
	return { min, max, shouldInverse };
}

function getCropInfo(
	arr: Float32Array,
	w: number,
	h: number,
	tolerance: number = 0.7
): number[] {
	let minCol = w, maxCol = -1, minRow = h, maxRow = -1;
	// 找到包含值 > tol 的最小/最大列
	for (let x = 0; x < w; x++) {
		for (let y = 0; y < h; y++) {
			if (arr[y * w + x] > tolerance) {
				if (x < minCol) minCol = x;
				if (x > maxCol) maxCol = x;
			}
		}
	}
	// 找到包含值 > tol 的最小/最大行
	for (let y = 0; y < h; y++) {
		for (let x = minCol; x <= maxCol; x++) {
			if (arr[y * w + x] > tolerance) {
				if (y < minRow) minRow = y;
				if (y > maxRow) maxRow = y;
				break;
			}
		}
	}
	if (maxCol < minCol || maxRow < minRow) {
		console.warn("Crop found no content above tolerance, returning original.");
		return [0, 0, w, h];
	}

	const cw = maxCol - minCol + 1;
	const ch = maxRow - minRow + 1;
	return [minCol, minRow, cw, ch];
}

function preprocess(image: ImageBitmap): Float32Array {
	const { width, height } = image;
	const canvas = new OffscreenCanvas(width, height);
	const ctx = canvas.getContext("2d")!;
	ctx.drawImage(image, 0, 0, width, height);

	// 1. 转换到灰度图
	const imageData = ctx.getImageData(0, 0, image.width, image.height);
	const grayData = toGray(imageData);

	// 2. 标准化
	const { min, max, shouldInverse } = getNormInfo(grayData);
	const normData = grayData.map((v) => {
		let normalized = (v - min) / (max - min);
		if (shouldInverse) normalized = 1 - normalized;
		return normalized;
	});

	// 3. 计算裁剪
	const cropBox = getCropInfo(normData, width, height);
	if (cropBox[2] <= 0 || cropBox[3] <= 0) {
		console.warn("Preprocessing crop step resulted in zero dimensions, returning empty tensor.");
		return new Float32Array(TARGET_W * TARGET_H).fill(0);
	}

	// 4. 裁剪并缩放 384x32
	const [cx, cy, cw, ch] = cropBox;
	const maxNewCW = Math.floor(TARGET_W * (ch / TARGET_H));
	const newCW = Math.min(cw, maxNewCW);
	const newW = Math.round(newCW * (TARGET_H / ch));
	const cropCanvas = new OffscreenCanvas(TARGET_W, TARGET_H);
	const cropCtx = cropCanvas.getContext("2d")!;
	cropCtx.imageSmoothingEnabled = true;
	cropCtx.fillStyle = shouldInverse ? "#fff" : "#000";
	cropCtx.fillRect(0, 0, TARGET_W, TARGET_H);
	cropCtx.drawImage(
		canvas,
		cx, cy, newCW, ch,
		0, 0, newW, TARGET_H
	);

	// saveOffscreenCanvas(cropCanvas, "crop.png");

	// 5. 灰度化
	const grayCropData = cropCtx.getImageData(0, 0, TARGET_W, TARGET_H);
	const grayCrop = toGray(grayCropData);

	// 6. 标准化并二值化
	const { min: cropMin, max: cropMax } = getNormInfo(grayCrop);
	const normCrop = grayCrop.map((v) => {
		let normalized = (v - cropMin) / (cropMax - cropMin);
		if (shouldInverse) normalized = 1 - normalized;
		return normalized > 0.6 ? 1 : 0; // 二值化
	});

	return normCrop;
}

async function recognitionInference(
	recSession: InferenceSession,
	imageF32: Float32Array
): Promise<Float32Array> {
	const inputName = recSession.inputNames[0];
	const tensor = new Tensor("float32", imageF32, [1, 1, TARGET_H, TARGET_W]);
	const outputMap = await recSession.run({ [inputName]: tensor });
	const ret = outputMap[recSession.outputNames[0]].data as Float32Array;
	return ret;
}

function postprocess(arr: Float32Array, indexToWord: string[]): string {
	const seqLen = arr.length / NUM_CLASSES;
	let ans = "";
	let last = "";
	for (let i = 0; i < seqLen; i++) {
		let maxIdx = 0;
		let maxVal = -Infinity;
		for (let j = 0; j < NUM_CLASSES; j++) {
			const v = arr[i * NUM_CLASSES + j];
			if (v > maxVal) {
				maxVal = v;
				maxIdx = j;
			}
		}
		const w = indexToWord[maxIdx];
		if (w !== last && w !== "-") {
			ans += w;
		}
		last = w;
	}
	return ans;
}

export async function recognition(
	recSession: InferenceSession,
	indexToWord: string[],
	image: ImageBitmap
): Promise<string> {
	const inputData = preprocess(image);
	const tensor = await recognitionInference(recSession, inputData);
	const text = postprocess(tensor, indexToWord);
	return text;
}
