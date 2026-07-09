import { PowerPointObjectRenderer } from "../../export/powerpoint-renderer/types/PowerPointObjectRenderer";
import { BrowserCanvasObjectRenderer } from "../../renderer/browser-canvas/types/BrowserCanvasObjectRenderer";
import { SlideObject } from "../../types/SlideObject";
import { ThreeObjectType } from "../objects/ThreeObjectType";
import { renderThreeSceneFallback } from "./renderThreeSceneFallback";
import { renderThreeScenePowerPointFallback } from "./renderThreeScenePowerPointFallback";

export const THREE_FALLBACK_OBJECT_RENDERERS: Record<
  string,
  BrowserCanvasObjectRenderer<SlideObject>
> = {
  [ThreeObjectType.SCENE]: renderThreeSceneFallback as BrowserCanvasObjectRenderer<SlideObject>,
};

export const THREE_POWERPOINT_FALLBACK_OBJECT_RENDERERS: Record<
  string,
  PowerPointObjectRenderer<SlideObject>
> = {
  [ThreeObjectType.SCENE]:
    renderThreeScenePowerPointFallback as PowerPointObjectRenderer<SlideObject>,
};
