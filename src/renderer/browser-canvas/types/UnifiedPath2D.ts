import { type Path2D as SkiaPath2D } from "skia-canvas";

export const Path2DType = {
  Browser: "browser",
  Node: "node",
} as const;

export type Path2DType = (typeof Path2DType)[keyof typeof Path2DType];

export interface BrowserPath2D {
  readonly type: typeof Path2DType.Browser;
  readonly path: Path2D;
}

export interface NodePath2D {
  readonly type: typeof Path2DType.Node;
  readonly path: SkiaPath2D;
}

/**
 * A unified Path2D type that works in both browser and Node.js environments.
 */
export type UnifiedPath2D = BrowserPath2D | NodePath2D;
