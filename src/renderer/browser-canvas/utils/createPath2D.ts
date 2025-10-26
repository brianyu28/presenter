import { Path2DType, UnifiedPath2D } from "../types/UnifiedPath2D";

export function createPath2D(): UnifiedPath2D {
  const path = new Path2D();
  return {
    type: Path2DType.Browser,
    path,
  };
}
