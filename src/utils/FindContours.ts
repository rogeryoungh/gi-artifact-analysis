import { Box } from "./Box";

type Point = [number, number]; // [x, y]
export type Contour = Point[];

export interface BoundingBox {
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
}

export function bfsFindContours(
  buf: Uint8Array,
  width: number,
  height: number,
): Contour[] {
  if (buf.length !== width * height) {
    throw new Error("Buffer length does not match width*height");
  }

  const visited = new Uint8Array(buf.length);
  const dirs8: Point[] = [
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
  ];

  const contours: Contour[] = [];
  const queue: number[] = [];

  const idx = (x: number, y: number) => y * width + x;

  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      const startIdx = idx(x, y);
      if (buf[startIdx] && !visited[startIdx]) {
        // Flood‑fill BFS to gather component + boundary pixels
        queue.length = 0;
        queue.push(startIdx);
        visited[startIdx] = 1;
        const boundary = new Set<number>();

        while (queue.length) {
          const cur = queue.shift() as number;
          const cy = Math.floor(cur / width);
          const cx = cur - cy * width;
          let isBoundary = false;

          for (const [dx, dy] of dirs8) {
            const nx = cx + dx;
            const ny = cy + dy;
            if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
              const nIdx = idx(nx, ny);
              if (buf[nIdx]) {
                if (!visited[nIdx]) {
                  visited[nIdx] = 1;
                  queue.push(nIdx);
                }
              } else {
                isBoundary = true;
              }
            } else {
              isBoundary = true; // outside image considered background
            }
          }
          if (isBoundary) boundary.add(cur);
        }

        if (boundary.size > 0) {
          contours.push(mooreTrace(boundary, width, dirs8));
        }
      }
    }
  }

  return contours;
}

function mooreTrace(
  boundary: Set<number>,
  width: number,
  dirs: Point[]
): Contour {
  const nDirs = dirs.length;
  const toXY = (idx: number): Point => [idx % width, Math.floor(idx / width)];

  // find start pixel (minimum y, then x)
  let startIdx = -1;
  let minY = Infinity,
    minX = Infinity;
  for (const p of boundary) {
    const [x, y] = toXY(p);
    if (y < minY || (y === minY && x < minX)) {
      minY = y;
      minX = x;
      startIdx = p;
    }
  }
  let current = startIdx;
  let prevDir = 6;
  const contour: Contour = [];

  while (true) {
    contour.push(toXY(current));
    boundary.delete(current);
    let foundNext = false;

    for (let i = 0; i < nDirs; ++i) {
      const idxDir = (prevDir + 1 + i) % nDirs;
      const [dx, dy] = dirs[idxDir];
      const [cx, cy] = toXY(current);
      const nx = cx + dx;
      const ny = cy + dy;
      if (ny >= 0 && ny < Infinity && nx >= 0 && nx < Infinity) {
        const nIdx = ny * width + nx;
        if (boundary.has(nIdx)) {
          current = nIdx;
          prevDir = (idxDir + nDirs / 2) % nDirs; // opposite direction
          foundNext = true;
          break;
        }
      }
    }

    if (!foundNext || current === startIdx) break;
  }

  return contour;
}

export function contourArea(c: Contour): number {
  if (c.length < 3) return 0;
  let area = 0;
  for (let i = 0; i < c.length; ++i) {
    const [x1, y1] = c[i];
    const [x2, y2] = c[(i + 1) % c.length];
    area += x1 * y2 - x2 * y1;
  }
  return Math.abs(area) / 2;
}

export function contourPerimeter(c: Contour): number {
  if (!c.length) return 0;
  let per = 0;
  for (let i = 0; i < c.length; ++i) {
    const [x1, y1] = c[i];
    const [x2, y2] = c[(i + 1) % c.length];
    per += Math.hypot(x2 - x1, y2 - y1);
  }
  return per;
}

export function boundingBox(c: Contour): Box {
  let xMin = Infinity,
    yMin = Infinity,
    xMax = -Infinity,
    yMax = -Infinity;
  for (const [x, y] of c) {
    if (x < xMin) xMin = x;
    if (y < yMin) yMin = y;
    if (x > xMax) xMax = x;
    if (y > yMax) yMax = y;
  }
  return new Box(xMin, yMin, xMax, yMax);
}
