import { Path2D } from "skia-canvas";

import { Path2DType, UnifiedPath2D } from "../../renderer/browser-canvas/types/UnifiedPath2D";

export function createPath2D(pathData?: string | undefined): UnifiedPath2D {
  const path = new Path2D(pathData);
  return {
    type: Path2DType.Node,
    path,
  };
}
