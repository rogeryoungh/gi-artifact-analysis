import cv from '@techstark/opencv-js'; // Assuming cv is initialized elsewhere
import { Box } from './Box'; // Your provided Box class

/**
 * Performs post-processing for DBNet-like text detection algorithms
 * using a fixed threshold on the probability map.
 *
 * Requires OpenCV.js (cv) to be loaded and initialized.
 * Remember to manage memory by calling .delete() on Mats.
 *
 * @param probArray Float32Array containing the probability map (values 0.0 to 1.0).
 * @param width The width of the probability map.
 * @param height The height of the probability map.
 * @param binaryThreshold The threshold value (0.0 to 1.0) to binarize the probability map. Defaults to 0.2.
 * @param minBoxArea The minimum area (in pixels) for a contour to be considered a valid text box. Defaults to 10.
 * @param boxExpandRatio The ratio to expand the detected bounding box. Use 1.0 for no expansion. Defaults to 1.1.
 * @returns An array of detected Box objects.
 */
export function dbPostProcess(
	probArray: Float32Array,
	width: number,
	height: number,
	binaryThreshold: number = 0.3,
	minBoxArea: number = 10,
	boxExpandRatio: [number, number] = [1.2, 3]
): Box[] {
	let src: cv.Mat | null = null;
	let binaryMat: cv.Mat | null = null;
	let contours: cv.MatVector | null = null;
	let hierarchy: cv.Mat | null = null;
	const resultBoxes: Box[] = [];

	try {
		// 1. Create Mat from probability array
		// Input is Float32Array (CV_32F), need to convert to 8-bit (CV_8U) for thresholding and contour finding.
		// Scale probabilities [0, 1] to [0, 255].
		let probMat32F = cv.matFromArray(height, width, cv.CV_32FC1, probArray);
		src = new cv.Mat(height, width, cv.CV_8UC1);
		probMat32F.convertTo(src, cv.CV_8UC1, 255.0);
		probMat32F.delete(); // Delete the intermediate float mat

		// 2. Binarize the probability map using the fixed threshold
		binaryMat = new cv.Mat();
		const thresholdValue = binaryThreshold * 255; // Scale threshold to 0-255 range
		cv.threshold(src, binaryMat, thresholdValue, 255, cv.THRESH_BINARY);

		// 3. Find contours
		contours = new cv.MatVector();
		hierarchy = new cv.Mat(); // Required by findContours
		// cv.RETR_LIST retrieves all contours without hierarchy.
		// cv.CHAIN_APPROX_SIMPLE compresses horizontal, vertical, and diagonal segments, leaving only their end points.
		cv.findContours(binaryMat, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);

		// 4. Filter contours and generate bounding boxes
		for (let i = 0; i < contours.size(); ++i) {
			const contour = contours.get(i);
			const area = cv.contourArea(contour);
			const perimeter = cv.arcLength(contour, true); // true for closed contour
			console.log("contor size", contour.size(), "area", area);
			// convert to array and log
			console.log("contour", Array.from(contour.data32S));

			// Filter by minimum area
			if (area >= minBoxArea) {
				// 5. Get axis-aligned bounding rectangle
				const rect = cv.boundingRect(contour);

				console.log("contours", rect);

				// 6. Create Box object (adjusting for x2, y2)
				const x1 = rect.x;
				const y1 = rect.y;
				const x2 = rect.x + rect.width;
				const y2 = rect.y + rect.height;

				let box = new Box(x1, y1, x2, y2);

				// 7. Expand the box using the provided method, clamping to image boundaries
				// Use the original map dimensions (width, height) for maxW, maxH in expand
				// box = box.expand(boxExpandRatio[0], boxExpandRatio[1], width, height);
				box = box.expandDynamically(area, perimeter, 2, width, height);


				// Check if box is valid after expansion (e.g., width/height > 0)
				if (box.x2 > box.x1 && box.y2 > box.y1) {
					resultBoxes.push(box);
				}
			}

			// Clean up the individual contour Mat
			contour.delete();
		}

	} catch (error) {
		console.error("Error during dbPostProcess:", error);
		// Rethrow or handle as needed
		throw error;
	} finally {
		// 8. Clean up all allocated OpenCV Mats
		src?.delete();
		binaryMat?.delete();
		contours?.delete();
		hierarchy?.delete();
	}

	return resultBoxes;
}
