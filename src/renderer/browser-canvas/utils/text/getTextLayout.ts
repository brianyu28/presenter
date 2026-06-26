import { Size } from "../../../../types/Size";
import { TextUnitMeasurement } from "./getTextUnitMeasurements";

export interface TextLineLayout extends Size {
  readonly baselineY: number;
  readonly bottom: number;
  readonly lineAdvance: number;
  readonly top: number;
}

export interface TextLayout {
  readonly lines: readonly TextLineLayout[];
  readonly size: Size;
}

function getLineLayout(
  lineMeasurements: readonly TextUnitMeasurement[],
): Omit<TextLineLayout, "baselineY"> {
  return {
    bottom: Math.max(...lineMeasurements.map((unit) => unit.bottom), 0),
    height: Math.max(...lineMeasurements.map((unit) => unit.height), 0),
    lineAdvance: Math.max(...lineMeasurements.map((unit) => unit.lineAdvance), 0),
    top: Math.max(...lineMeasurements.map((unit) => unit.top), 0),
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
): TextLayout {
  const lines = lineMeasurements.map(getLineLayout);

  if (lines.length === 0) {
    return {
      lines: [],
      size: Size(),
    };
  }

  let baselineY = lines[0]?.top ?? 0;
  let previousLineAdvance = 0;
  const positionedLines: TextLineLayout[] = [];

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];

    if (line === undefined) {
      continue;
    }

    if (lineIndex > 0) {
      // Line spacing is typographic baseline advance
      baselineY += previousLineAdvance * lineSpacing;
    }

    positionedLines.push({
      ...line,
      baselineY,
    });
    previousLineAdvance = line.lineAdvance;
  }

  // Bounds are based on the furthest measured font box above and below each baseline
  const top = Math.min(...positionedLines.map((line) => line.baselineY - line.top), 0);
  const bottom = Math.max(...positionedLines.map((line) => line.baselineY + line.bottom), 0);
  const baselineOffset = -top;

  return {
    lines: positionedLines.map((line) => ({
      ...line,
      // Keep all returned baselines relative to the top edge of the final text block
      baselineY: line.baselineY + baselineOffset,
    })),
    size: Size({
      height: bottom - top,
      width: Math.max(...positionedLines.map((line) => line.width), 0),
    }),
  };
}
