import { Size } from "../../../../types/Size";
import { TextStyle } from "../../../../types/TextStyle";
import { TextUnit } from "../../../../types/TextUnit";
import { UnifiedCanvasContext } from "../../types/UnifiedCanvasContext";
import { getSizeFromTextMetrics } from "../getSizeFromTextMetrics";
import { setContextWithTextStyle } from "./setContextWithTextStyle";

export function getTextUnitMeasurements(
  textUnits: TextUnit[][],
  style: TextStyle,
  ctx: UnifiedCanvasContext,
): Size[][] {
  const sizes: Size[][] = [];

  for (const line of textUnits) {
    const lineSizes: Size[] = [];
    for (const unit of line) {
      const { text, ...unitStyle } = unit;
      const combinedStyle: TextStyle = { ...style, ...unitStyle };
      setContextWithTextStyle(ctx, combinedStyle);
      const metrics = ctx.context.measureText(text);
      lineSizes.push(getSizeFromTextMetrics(metrics));
    }
    sizes.push(lineSizes);
  }

  return sizes;
}
