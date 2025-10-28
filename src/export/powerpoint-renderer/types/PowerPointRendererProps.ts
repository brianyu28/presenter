import { Presentation } from "../../../types/Presentation";
import { SlideObject } from "../../../types/SlideObject";
import { PowerPointObjectRenderer } from "./PowerPointObjectRenderer";

export interface PowerPointRendererProps {
  readonly presentation: Presentation;
  readonly objectRenderers: Record<string, PowerPointObjectRenderer<SlideObject>>;
  readonly pixelsPerInch: number;
  readonly resourcePathPrefix: string;
}
