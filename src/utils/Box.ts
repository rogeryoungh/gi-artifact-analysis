export class Box {
  constructor(
    public x1: number,
    public y1: number,
    public x2: number,
    public y2: number
  ) { }

  /**
   * (原有函数) 沿中心按固定比例放大，并 clamp 到 [0,maxW],[0,maxH]
   */
  expand(ratioX: number, ratioY: number, maxW: number, maxH: number): Box {
    const cx = (this.x1 + this.x2) / 2;
    const cy = (this.y1 + this.y2) / 2;
    const w = (this.x2 - this.x1) * ratioX;
    const h = (this.y2 - this.y1) * ratioY;
    const nx1 = Math.max(0, cx - w / 2);
    const ny1 = Math.max(0, cy - h / 2);
    const nx2 = Math.min(maxW, cx + w / 2);
    const ny2 = Math.min(maxH, cy + h / 2);
    return new Box(nx1, ny1, nx2, ny2);
  }

  /**
   * 新增函数：
   * 根据原始轮廓的几何特征 (面积 area, 周长 perimeter) 和 unclipRatio
   * 动态计算扩展距离 distance，然后将当前 Box 的四个边向外扩展 distance。
   * 模拟 DBNet 后处理中的 unclip 步骤 (针对水平文字的简化版本)。
   * 最后 clamp 到 [0, maxW], [0, maxH]。
   *
   * @param {number} area - 原始检测轮廓的面积 (由 OpenCV 的 cv2.contourArea(contour) 获得)。
   * @param {number} perimeter - 原始检测轮廓的周长 (由 OpenCV 的 cv2.arcLength(contour, True) 获得)。
   * @param {number} unclipRatio - 扩展比例因子 (例如 2.0)，同 DBPostProcess 中的参数。
   * @param {number} maxW - 图像最大宽度，用于限制坐标。
   * @param {number} maxH - 图像最大高度，用于限制坐标。
   * @returns {Box} 扩展并裁剪后的新 Box 对象。
   */
  expandDynamically(area: number, perimeter: number, unclipRatio: number, maxW: number, maxH: number): Box {
    // 1. 计算扩展距离 distance
    let distance = 0;
    // 防止周长过小导致除零错误
    if (perimeter > 1e-6) {
      distance = (area * unclipRatio) / perimeter;
    } else {
      console.warn("Perimeter is too small, cannot calculate dynamic expansion distance. Returning original box.");
      // 周长过小无法计算，可以选择不扩展，直接返回当前Box
      // 或者可以根据需要返回一个错误或默认值
      return new Box(
        Math.max(0, this.x1),
        Math.max(0, this.y1),
        Math.min(maxW, this.x2),
        Math.min(maxH, this.y2)
      );
    }

    // console.log(`Calculated dynamic distance: ${distance}`); // 用于调试

    // 2. 计算扩展后的原始坐标 (不考虑边界)
    // 注意：这里是对当前 Box 的坐标进行扩展
    const nx1_raw = this.x1 - distance;
    const ny1_raw = this.y1 - distance;
    const nx2_raw = this.x2 + distance;
    const ny2_raw = this.y2 + distance;

    // 3. Clamp 到图像边界 [0, maxW] 和 [0, maxH]
    const nx1 = Math.max(0, nx1_raw);
    const ny1 = Math.max(0, ny1_raw);
    const nx2 = Math.min(maxW, nx2_raw);
    const ny2 = Math.min(maxH, ny2_raw);

    // 4. 返回新的 Box 对象
    return new Box(nx1, ny1, nx2, ny2);
  }
}
