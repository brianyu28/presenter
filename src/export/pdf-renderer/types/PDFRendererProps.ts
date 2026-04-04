import { BrowserCanvasObjectRenderer } from "../../../renderer/browser-canvas/types/BrowserCanvasObjectRenderer";
import { Presentation } from "../../../types/Presentation";

export interface PDFRendererProps {
  readonly presentation: Presentation;
  readonly objectRenderers: Record<string, BrowserCanvasObjectRenderer<any>>;
  readonly resourcePathPrefix: string;
}
