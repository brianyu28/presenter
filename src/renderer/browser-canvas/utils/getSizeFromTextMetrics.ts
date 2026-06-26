import { Size } from "../../../types/Size";

export interface TextMetricsSize extends Size {
  readonly bottom: number;
  readonly top: number;
}

function getMetricValue(value: number | undefined, fallback: number = 0): number {
  return value != null ? value : fallback;
}

export function getSizeFromTextMetrics(textMetrics: TextMetrics): TextMetricsSize {
  // Distance from baseline up to top of font box
  const top = getMetricValue(
    textMetrics.fontBoundingBoxAscent,
    textMetrics.actualBoundingBoxAscent,
  );

  // Distance from baseline to bottom of font box
  const bottom = getMetricValue(
    textMetrics.fontBoundingBoxDescent,
    textMetrics.actualBoundingBoxDescent,
  );

  return {
    bottom,
    height: top + bottom,
    top,
    width: textMetrics.width,
  };
}
