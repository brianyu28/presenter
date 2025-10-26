import { Rectangle } from "../../../objects/Rectangle";
import { UnifiedPath2D } from "../../../renderer/browser-canvas/types/UnifiedPath2D";
import { PathWithLength } from "../../../types/PathWithLength";
import { Position } from "../../../types/Position";
import { Size } from "../../../types/Size";
import { getBoundingBox } from "../../layout/getBoundingBox";
import { getRoundedRectanglePath } from "./getRoundedRectanglePath";

export function getRectanglePath(
  rectangle: Rectangle,
  createPath: () => UnifiedPath2D,
): PathWithLength {
  const { origin, size } = getBoundingBox(
    Position({ x: rectangle.x, y: rectangle.y }),
    rectangle.anchor,
    Size({ width: rectangle.width, height: rectangle.height }),
  );

  const rounding = Math.max(0, Math.min(rectangle.rounding, Math.min(size.width, size.height) / 2));

  // Overshoot needed so that when path is drawn, the line caps cover the corners fully
  const overshoot = Math.min(rectangle.borderWidth * 2, size.width - rounding);

  if (rounding > 0) {
    return getRoundedRectanglePath(origin, size, rounding, createPath, overshoot);
  } else {
    const path = createPath();
    path.path.moveTo(origin.x, origin.y);
    path.path.lineTo(origin.x + size.width, origin.y);
    path.path.lineTo(origin.x + size.width, origin.y + size.height);
    path.path.lineTo(origin.x, origin.y + size.height);
    path.path.lineTo(origin.x, origin.y);
    path.path.lineTo(origin.x + overshoot, origin.y);

    const length = 2 * (size.width + size.height) + overshoot;
    return { path, length };
  }
}
