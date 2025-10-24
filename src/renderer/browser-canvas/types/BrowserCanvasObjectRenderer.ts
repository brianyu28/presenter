import { SlideObject } from "../../../types/SlideObject";

export interface BrowserCanvasObjectRendererArgs<T extends SlideObject> {
  readonly ctx: CanvasRenderingContext2D;
  readonly object: T;
  readonly opacity: number;

  readonly imageById: Record<string, HTMLImageElement>;
  readonly renderObject: (object: SlideObject, overallOpacity: number) => void;
}

export type BrowserCanvasObjectRenderer<T extends SlideObject> = (
  args: BrowserCanvasObjectRendererArgs<T>,
) => void;
