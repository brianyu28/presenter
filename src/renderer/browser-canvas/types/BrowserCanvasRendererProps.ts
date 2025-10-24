import { Presentation } from "../../../types/Presentation";
import { SlideObject } from "../../../types/SlideObject";
import { BrowserCanvasObjectRenderer } from "./BrowserCanvasObjectRenderer";

export interface BrowserCanvasRendererProps {
  readonly presentation: Presentation;
  readonly element: HTMLElement;
  readonly objectRenderers: Record<string, BrowserCanvasObjectRenderer<SlideObject>>;

  readonly cacheDurationMinutes: number;
}
