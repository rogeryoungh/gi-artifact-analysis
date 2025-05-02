export class Box {
  constructor(
    public x1: number,
    public y1: number,
    public x2: number,
    public y2: number
  ) { }

  // 根据面积和周长动态计算扩展距离
  // 坐标轴矩形特化 unclip
  // https://github.com/RapidAI/RapidOCR/blob/main/python/rapidocr/ch_ppocr_det/utils.py#L264
  expand(area: number, perimeter: number, unclipRatio: number, maxW: number, maxH: number): Box {
    // 周长过小，可以选择不扩展，直接返回当前Box
    if (perimeter < 1e-6) {
      console.warn("Perimeter is too small, cannot calculate dynamic expansion distance. Returning original box.");
      return new Box(this.x1, this.y1, this.x2, this.y2);
    }

    const distance = (area * unclipRatio) / perimeter;

    // 扩大，并 clamp 到边界
    const nx1 = Math.max(0, this.x1 - distance);
    const ny1 = Math.max(0, this.y1 - distance);
    const nx2 = Math.min(maxW, this.x2 + distance);
    const ny2 = Math.min(maxH, this.y2 + distance);
    return new Box(nx1, ny1, nx2, ny2);
  }
}
