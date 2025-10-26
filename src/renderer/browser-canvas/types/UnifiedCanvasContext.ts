import { type CanvasRenderingContext2D as SkiaCanvasRenderingContext2D } from "skia-canvas";

export const CanvasContextType = {
  Browser: "browser",
  Node: "node",
} as const;

export type CanvasContextType = (typeof CanvasContextType)[keyof typeof CanvasContextType];

export interface BrowserCanvasContext {
  readonly type: typeof CanvasContextType.Browser;
  readonly context: CanvasRenderingContext2D;
}

export interface NodeCanvasContext {
  readonly type: typeof CanvasContextType.Node;
  readonly context: SkiaCanvasRenderingContext2D;
}

/**
 * A unified CanvasRenderingContext2D type that works in both browser and Node.js environments.
 */
export type UnifiedCanvasContext = BrowserCanvasContext | NodeCanvasContext;
