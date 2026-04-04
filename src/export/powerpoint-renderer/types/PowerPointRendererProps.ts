import { Presentation } from "../../../types/Presentation";
import { PowerPointObjectRenderer } from "./PowerPointObjectRenderer";

export interface PowerPointRendererProps {
  readonly presentation: Presentation;
  readonly objectRenderers: Record<string, PowerPointObjectRenderer<any>>;
  readonly pixelsPerInch: number;
  readonly resourcePathPrefix: string;
}
