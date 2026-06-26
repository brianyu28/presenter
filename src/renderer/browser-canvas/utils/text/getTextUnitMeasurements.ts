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
  readonly lineAdvance: number;
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
    const measurementUnits = line.length === 0 ? [{ text: "" }] : line;

    for (const unit of measurementUnits) {
      const { text, ...unitStyle } = unit;
      const combinedStyle: TextStyle = { ...style, ...unitStyle };
      setContextWithTextStyle(ctx, combinedStyle);
      const metrics = ctx.context.measureText(text);
      const size = getSizeFromTextMetrics(metrics);
      const { baselineShift } = getTextScriptVariant(combinedStyle);
      const top = Math.max(0, size.top - baselineShift);
      const bottom = Math.max(0, size.bottom + baselineShift);
      lineSizes.push({
        ...size,
        baselineShift,
        bottom,
        height: top + bottom,
        lineAdvance: combinedStyle.fontSize,
        top,
      });
    }
    sizes.push(lineSizes);
  }

  return sizes;
}
