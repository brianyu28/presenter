import { Size } from "../../../../types/Size";
import { TextStyle } from "../../../../types/TextStyle";
import { TextUnit } from "../../../../types/TextUnit";
import { getTextScriptVariant } from "../../../../utils/objects/text/getTextScriptVariant";
import { UnifiedCanvasContext } from "../../types/UnifiedCanvasContext";
import { getSizeFromTextMetrics } from "../getSizeFromTextMetrics";
import { setContextWithTextStyle } from "./setContextWithTextStyle";

/**
 * Font measurements for one styled text unit, in canvas pixels.
 *
 * The inherited `width` is the horizontal advance, while `height` is `top + bottom`.
 */
export interface TextUnitMeasurement extends Size {
  /** Offset added to the line baseline when drawing; negative values move text upward. */
  readonly baselineShift: number;
  /** Distance from the line baseline to the bottom of the font bounds. */
  readonly bottom: number;
  /** Font size used to calculate the line box height. */
  readonly lineAdvance: number;
  /** Distance from the line baseline to the top of the font bounds. */
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
    // Empty lines still need the base style's metrics so they occupy a line box
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
