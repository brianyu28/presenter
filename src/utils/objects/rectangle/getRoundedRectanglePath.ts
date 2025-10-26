import { UnifiedPath2D } from "../../../renderer/browser-canvas/types/UnifiedPath2D";
import { PathWithLength } from "../../../types/PathWithLength";
import { Position } from "../../../types/Position";
import { Size } from "../../../types/Size";

export function getRoundedRectanglePath(
  origin: Position,
  size: Size,
  rounding: number,
  createPath: () => UnifiedPath2D,
  overshoot: number = 0,
): PathWithLength {
  const path = createPath();

  path.path.moveTo(origin.x + rounding, origin.y);
  path.path.lineTo(origin.x + size.width - rounding, origin.y);
  path.path.arcTo(
    origin.x + size.width,
    origin.y,
    origin.x + size.width,
    origin.y + rounding,
    rounding,
  );
  path.path.lineTo(origin.x + size.width, origin.y + size.height - rounding);
  path.path.arcTo(
    origin.x + size.width,
    origin.y + size.height,
    origin.x + size.width - rounding,
    origin.y + size.height,
    rounding,
  );
  path.path.lineTo(origin.x + rounding, origin.y + size.height);
  path.path.arcTo(
    origin.x,
    origin.y + size.height,
    origin.x,
    origin.y + size.height - rounding,
    rounding,
  );
  path.path.lineTo(origin.x, origin.y + rounding);
  path.path.arcTo(origin.x, origin.y, origin.x + rounding, origin.y, rounding);
  if (overshoot > 0) {
    path.path.lineTo(origin.x + rounding + overshoot, origin.y);
  }

  const length = 2 * (size.width + size.height - 4 * rounding) + 2 * Math.PI * rounding + overshoot;
  return { path, length };
}
