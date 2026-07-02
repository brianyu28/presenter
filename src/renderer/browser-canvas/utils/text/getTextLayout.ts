import { Size } from "../../../../types/Size";
import { TextUnitMeasurement } from "./getTextUnitMeasurements";

// Units flow horizontally, so widths add; their vertical extents share a baseline,
// so the largest ascent, descent, and line advance define the line.
function getLineLayout(lineMeasurements: readonly TextUnitMeasurement[]) {
  const bottom = Math.max(...lineMeasurements.map((unit) => unit.bottom), 0);
  const top = Math.max(...lineMeasurements.map((unit) => unit.top), 0);

  return {
    bottom,
    height: top + bottom,
    lineAdvance: Math.max(...lineMeasurements.map((unit) => unit.lineAdvance), 0),
    top,
    width: lineMeasurements.reduce((acc, curr) => acc + curr.width, 0),
  };
}

/**
 * Computes text block bounds and per-line baseline positions.
 *
 * Accepts as input per-line measurements for each text unit, plus a desired line spacing.
 */
export function getTextLayout(
  lineMeasurements: readonly (readonly TextUnitMeasurement[])[],
  lineSpacing: number = 1,
) {
  const lines = lineMeasurements.map(getLineLayout);

  if (lines.length === 0) {
    return {
      baselines: [],
      size: Size(),
    };
  }

  let baselineY = 0;
  let previousLineBoxBottom: number | undefined;
  let layoutTop = 0;
  let layoutBottom = 0;
  const baselines: number[] = [];

  for (const line of lines) {
    // lineSpacing scales the nominal font size. Any extra (or negative) leading
    // is split evenly above and below the measured font bounds.
    const lineHeight = line.lineAdvance * lineSpacing;
    const halfLeading = (lineHeight - line.height) / 2;
    const lineBoxTop = line.top + halfLeading;

    if (previousLineBoxBottom === undefined) {
      baselineY = lineBoxTop;
    } else {
      // Adjacent line boxes meet at the previous descent and current ascent.
      baselineY += previousLineBoxBottom + lineBoxTop;
    }

    baselines.push(baselineY);

    // Use font bounds for the final block size because they can extend beyond
    // the nominal line boxes when leading is negative.
    layoutTop = Math.min(layoutTop, baselineY - line.top);
    layoutBottom = Math.max(layoutBottom, baselineY + line.bottom);
    previousLineBoxBottom = line.bottom + halfLeading;
  }

  // Return baselines relative to the top edge of the measured text block.
  const baselineOffset = -layoutTop;

  return {
    baselines: baselines.map((baseline) => baseline + baselineOffset),
    size: Size({
      height: layoutBottom - layoutTop,
      width: Math.max(...lines.map((line) => line.width), 0),
    }),
  };
}
