import { env } from 'onnxruntime-web';

export function setWasmPath() {
	const url = "/ajax/libs/onnxruntime-web/1.21.0-dev.20250109-3328eb3bb3/";
	if (import.meta.env.MODE === "development") {
		env.wasm.wasmPaths = 'https://cdnjs.cloudflare.com' + url;
	} else {
		env.wasm.wasmPaths = 'https://s4.zstatic.net' + url;
	}
}
