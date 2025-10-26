import { Line } from "../../../objects/Line";
import { UnifiedPath2D } from "../../../renderer/browser-canvas/types/UnifiedPath2D";
import { PathWithLength } from "../../../types/PathWithLength";

export function getLinePath(line: Line, createPath: () => UnifiedPath2D): PathWithLength {
  const path = createPath();

  path.path.moveTo(line.startX, line.startY);
  path.path.lineTo(line.endX, line.endY);

  const length = Math.hypot(line.endX - line.startX, line.endY - line.startY);

  return { path, length };
}
