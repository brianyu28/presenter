import { BrowserCanvasObjectRenderer } from "../../../renderer/browser-canvas/types/BrowserCanvasObjectRenderer";
import { Presentation } from "../../../types/Presentation";
import { SlideObject } from "../../../types/SlideObject";

export interface PDFRendererProps {
  readonly presentation: Presentation;
  readonly objectRenderers: Record<string, BrowserCanvasObjectRenderer<SlideObject>>;
  readonly resourcePathPrefix: string;
}
