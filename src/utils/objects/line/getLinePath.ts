import { Line } from "../../../objects/Line";
import { PathWithLength } from "../../../types/PathWithLength";

export function getLinePath(line: Line): PathWithLength {
  const path = new Path2D();

  path.moveTo(line.startX, line.startY);
  path.lineTo(line.endX, line.endY);

  const length = Math.hypot(line.endX - line.startX, line.endY - line.startY);

  return { path, length };
}
