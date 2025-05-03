import type { OcrResult } from "../services/OcrService";
import type { RawEntry } from "./ArtifactUtils";
import type { Box } from "./Box";

function checkVerticalOverlapRate(box1: Box, box2: Box) {
	const overlapHeight = Math.min(box1.y2, box2.y2) - Math.max(box1.y1, box2.y1);
	if (overlapHeight <= 0) {
		return -1;
	}
	const box1Height = box1.y2 - box1.y1;
	return overlapHeight / box1Height;
}

export function pairAttribute(data: OcrResult[], threshold: number = 0.8): RawEntry[] {
	const sortedData = data.sort((a, b) => a.box.y1 - b.box.y1);

	const n = sortedData.length;
	const paired: boolean[] = new Array(n).fill(false);
	const results: RawEntry[] = [];

	const startWithNumber = /^\d/;

	for (let i = 0; i < n; i++) {
		if (paired[i]) continue;
		const current = sortedData[i];
		if (current.text.match(startWithNumber)) {
			continue;
		}
		paired[i] = true;
		if (current.text.startsWith('+')) {
			results.push([current.text]);
		} else if (current.text.indexOf('+') > 0) {
			const [k, v] = current.text.split('+', 2);
			results.push([k, v]);
		} else {
			for (let j = 0; j < n; j++) {
				if (j === i || paired[j]) continue;
				const next = sortedData[j];
				const overlapRate = checkVerticalOverlapRate(current.box, next.box);
				if (overlapRate > threshold) {
					paired[j] = true;
					if (current.text !== "" && next.text !== "") {
						results.push([current.text, next.text]);
					}
					break;
				}
			}
		}
	}
	return results;
}