import { Size } from "../../../../types/Size";
import { TextStyle } from "../../../../types/TextStyle";
import { TextUnit } from "../../../../types/TextUnit";
import { getTextScriptVariant } from "../../../../utils/objects/text/getTextScriptVariant";
import { UnifiedCanvasContext } from "../../types/UnifiedCanvasContext";
import { getSizeFromTextMetrics } from "../getSizeFromTextMetrics";
import { setContextWithTextStyle } from "./setContextWithTextStyle";

export interface TextUnitMeasurement extends Size {
  readonly baselineShift: number;
  readonly bottom: number;
  readonly top: number;
}

export function getTextUnitMeasurements(
  textUnits: TextUnit[][],
  style: TextStyle,
  ctx: UnifiedCanvasContext,
): TextUnitMeasurement[][] {
  const sizes: TextUnitMeasurement[][] = [];

  for (const line of textUnits) {
    const lineSizes: TextUnitMeasurement[] = [];
    for (const unit of line) {
      const { text, ...unitStyle } = unit;
      const combinedStyle: TextStyle = { ...style, ...unitStyle };
      setContextWithTextStyle(ctx, combinedStyle);
      const metrics = ctx.context.measureText(text);
      const size = getSizeFromTextMetrics(metrics);
      const { baselineShift } = getTextScriptVariant(combinedStyle);
      const top = size.height + Math.max(0, -baselineShift);
      const bottom = Math.max(0, baselineShift);
      lineSizes.push({
        ...size,
        baselineShift,
        bottom,
        height: top + bottom,
        top,
      });
    }
    sizes.push(lineSizes);
  }

  return sizes;
}
