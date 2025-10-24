import { PathWithLength } from "../../../types/PathWithLength";
import { Position } from "../../../types/Position";
import { Size } from "../../../types/Size";

export function getRoundedRectanglePath(
  origin: Position,
  size: Size,
  rounding: number,
  overshoot: number = 0,
): PathWithLength {
  const path = new Path2D();

  path.moveTo(origin.x + rounding, origin.y);
  path.lineTo(origin.x + size.width - rounding, origin.y);
  path.arcTo(origin.x + size.width, origin.y, origin.x + size.width, origin.y + rounding, rounding);
  path.lineTo(origin.x + size.width, origin.y + size.height - rounding);
  path.arcTo(
    origin.x + size.width,
    origin.y + size.height,
    origin.x + size.width - rounding,
    origin.y + size.height,
    rounding,
  );
  path.lineTo(origin.x + rounding, origin.y + size.height);
  path.arcTo(
    origin.x,
    origin.y + size.height,
    origin.x,
    origin.y + size.height - rounding,
    rounding,
  );
  path.lineTo(origin.x, origin.y + rounding);
  path.arcTo(origin.x, origin.y, origin.x + rounding, origin.y, rounding);
  if (overshoot > 0) {
    path.lineTo(origin.x + rounding + overshoot, origin.y);
  }

  const length = 2 * (size.width + size.height - 4 * rounding) + 2 * Math.PI * rounding + overshoot;
  return { path, length };
}
