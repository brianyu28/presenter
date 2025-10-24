import { Circle } from "../../../objects/Circle";
import { PathWithLength } from "../../../types/PathWithLength";

export function getCirclePath(circle: Circle): PathWithLength {
  const path = new Path2D();
  const startAngle = -Math.PI / 2;

  path.arc(circle.x, circle.y, circle.radius, startAngle, startAngle + 2 * Math.PI);
  const length = 2 * Math.PI * circle.radius;
  return { path, length };
}
