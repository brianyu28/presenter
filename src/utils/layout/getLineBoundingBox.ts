import { BoundingBox } from "../../types/BoundingBox";

export function getLineBoundingBox(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
): BoundingBox {
  const originX = Math.min(startX, endX);
  const originY = Math.min(startY, endY);
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);

  return BoundingBox({
    origin: { x: originX, y: originY },
    size: { width, height },
  });
}
