import { UnifiedPath2D } from "../../../renderer/browser-canvas/types/UnifiedPath2D";
import { PathWithLength } from "../../../types/PathWithLength";
import { Position } from "../../../types/Position";
import { Size } from "../../../types/Size";

export function getRoundedRectanglePath(
  origin: Position,
  size: Size,
  cornerRadius: number,
  createPath: () => UnifiedPath2D,
  overshoot: number = 0,
): PathWithLength {
  const path = createPath();

  path.path.moveTo(origin.x + cornerRadius, origin.y);
  path.path.lineTo(origin.x + size.width - cornerRadius, origin.y);
  path.path.arcTo(
    origin.x + size.width,
    origin.y,
    origin.x + size.width,
    origin.y + cornerRadius,
    cornerRadius,
  );
  path.path.lineTo(origin.x + size.width, origin.y + size.height - cornerRadius);
  path.path.arcTo(
    origin.x + size.width,
    origin.y + size.height,
    origin.x + size.width - cornerRadius,
    origin.y + size.height,
    cornerRadius,
  );
  path.path.lineTo(origin.x + cornerRadius, origin.y + size.height);
  path.path.arcTo(
    origin.x,
    origin.y + size.height,
    origin.x,
    origin.y + size.height - cornerRadius,
    cornerRadius,
  );
  path.path.lineTo(origin.x, origin.y + cornerRadius);
  path.path.arcTo(origin.x, origin.y, origin.x + cornerRadius, origin.y, cornerRadius);
  if (overshoot > 0) {
    path.path.lineTo(origin.x + cornerRadius + overshoot, origin.y);
  }

  const length =
    2 * (size.width + size.height - 4 * cornerRadius) + 2 * Math.PI * cornerRadius + overshoot;
  return { path, length };
}
