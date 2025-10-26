import { Circle } from "../../../objects/Circle";
import { UnifiedPath2D } from "../../../renderer/browser-canvas/types/UnifiedPath2D";
import { PathWithLength } from "../../../types/PathWithLength";

export function getCirclePath(circle: Circle, createPath: () => UnifiedPath2D): PathWithLength {
  const path = createPath();
  const startAngle = -Math.PI / 2;

  path.path.arc(circle.x, circle.y, circle.radius, startAngle, startAngle + 2 * Math.PI);
  const length = 2 * Math.PI * circle.radius;
  return { path, length };
}
