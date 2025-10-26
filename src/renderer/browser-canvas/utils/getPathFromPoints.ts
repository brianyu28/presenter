import { PathWithLength } from "../../../types/PathWithLength";
import { Position } from "../../../types/Position";
import { UnifiedPath2D } from "../types/UnifiedPath2D";

export function getPathFromPositions(
  positions: Position[],
  createPath: () => UnifiedPath2D,
): PathWithLength {
  const path = createPath();

  const firstPosition = positions[0];
  if (firstPosition === undefined) {
    return { path, length: 0 };
  }

  path.path.moveTo(firstPosition.x, firstPosition.y);

  let length = 0;

  for (let i = 1; i < positions.length; i++) {
    const position = positions[i];
    const prevPosition = positions[i - 1];

    if (position === undefined || prevPosition === undefined) {
      continue;
    }

    const dx = position.x - prevPosition.x;
    const dy = position.y - prevPosition.y;
    length += Math.hypot(dx, dy);
    path.path.lineTo(position.x, position.y);
  }

  return { path, length };
}
