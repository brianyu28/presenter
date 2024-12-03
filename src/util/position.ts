export interface Position {
  x: number;
  y: number;
}

export class BoundingBox {
  origin: Position;
  width: number;
  height: number;

  constructor(origin: Position, width: number, height: number) {
    this.origin = origin;
    this.width = width;
    this.height = height;
  }

  static fromElement(element: SVGElement): BoundingBox {
    // Untested. TODO: Investigate getBoundingClientRect() vs. getBBox()
    const rect = element.getBoundingClientRect();
    return new BoundingBox({ x: rect.x, y: rect.y }, rect.width, rect.height);
  }
}
