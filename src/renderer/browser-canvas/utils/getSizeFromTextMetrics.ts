import { Size } from "../../../types/Size";

export function getSizeFromTextMetrics(textMetrics: TextMetrics): Size {
  return {
    width: textMetrics.width,
    height: textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent,
  };
}
