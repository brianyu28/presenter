import pptxgenjs from "pptxgenjs";

import { UnifiedCanvasContext } from "../../../renderer/browser-canvas/types/UnifiedCanvasContext";
import { SlideObject } from "../../../types/SlideObject";
import { ObjectTransform } from "./ObjectTransform";

export interface PowerPointObjectRendererArgs<T extends SlideObject> {
  readonly ctx: UnifiedCanvasContext;
  readonly imagePathById: Record<string, string>;
  readonly powerpoint: pptxgenjs;
  readonly slide: pptxgenjs.Slide;
  readonly object: T;
  readonly opacity: number;
  readonly pixelsPerInch: number;
  readonly transform: ObjectTransform;

  readonly renderObject: (
    object: SlideObject,
    transform: ObjectTransform,
    overallOpacity: number,
  ) => void;
}

export type PowerPointObjectRenderer<T extends SlideObject> = (
  args: PowerPointObjectRendererArgs<T>,
) => void;
