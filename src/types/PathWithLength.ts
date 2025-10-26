import { UnifiedPath2D } from "../renderer/browser-canvas/types/UnifiedPath2D";

export interface PathWithLength {
  readonly path: UnifiedPath2D;
  readonly length: number;
}
