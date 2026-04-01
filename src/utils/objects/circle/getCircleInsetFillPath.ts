import { Circle } from "../../../objects/Circle";
import { UnifiedPath2D } from "../../../renderer/browser-canvas/types/UnifiedPath2D";

/**
 * Returns a circle path that is smaller than the original by half the border width.
 * This is used as a clip region when drawing semi-transparent shapes.
 */
export function getCircleInsetFillPath(
  circle: Circle,
  createPath: () => UnifiedPath2D,
): UnifiedPath2D | undefined {
  const insetRadius = circle.radius - circle.borderWidth / 2;
  if (insetRadius <= 0) {
    return undefined;
  }

  const path = createPath();
  const startAngle = -Math.PI / 2;
  path.path.arc(circle.x, circle.y, insetRadius, startAngle, startAngle + 2 * Math.PI);
  return path;
}
