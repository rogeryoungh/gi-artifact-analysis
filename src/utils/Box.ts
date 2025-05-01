export class Box {
  constructor(
    public x1: number,
    public y1: number,
    public x2: number,
    public y2: number
  ) { }

  /**
   * 沿中心放大 ratio 倍，并 clamp 到 [0,maxW],[0,maxH]
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
}
