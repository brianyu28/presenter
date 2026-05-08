import { Rectangle } from "../../../objects/Rectangle";
import { UnifiedPath2D } from "../../../renderer/browser-canvas/types/UnifiedPath2D";
import { Position } from "../../../types/Position";
import { Size } from "../../../types/Size";
import { getBoundingBox } from "../../layout/getBoundingBox";
import { getRoundedRectanglePath } from "./getRoundedRectanglePath";

/**
 * Returns a rectangle path that is smaller than the original by half the stroke width
 * on each side. This is used as a clip region when drawing semi-transparent shapes.
 */
export function getRectangleInsetFillPath(
  rectangle: Rectangle,
  createPath: () => UnifiedPath2D,
): UnifiedPath2D | undefined {
  const inset = rectangle.strokeWidth / 2;

  const { origin, size } = getBoundingBox(
    Position({ x: rectangle.x, y: rectangle.y }),
    rectangle.anchor,
    Size({ width: rectangle.width, height: rectangle.height }),
  );

  const insetWidth = size.width - rectangle.strokeWidth;
  const insetHeight = size.height - rectangle.strokeWidth;
  if (insetWidth <= 0 || insetHeight <= 0) {
    return undefined;
  }

  const insetOrigin = Position({ x: origin.x + inset, y: origin.y + inset });
  const insetSize = Size({ width: insetWidth, height: insetHeight });

  const cornerRadius = Math.max(
    0,
    Math.min(rectangle.cornerRadius - inset, Math.min(insetWidth, insetHeight) / 2),
  );

  if (cornerRadius > 0) {
    return getRoundedRectanglePath(insetOrigin, insetSize, cornerRadius, createPath).path;
  }

  const path = createPath();
  path.path.moveTo(insetOrigin.x, insetOrigin.y);
  path.path.lineTo(insetOrigin.x + insetWidth, insetOrigin.y);
  path.path.lineTo(insetOrigin.x + insetWidth, insetOrigin.y + insetHeight);
  path.path.lineTo(insetOrigin.x, insetOrigin.y + insetHeight);
  path.path.closePath();
  return path;
}
