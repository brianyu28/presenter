import { Line } from "../../../objects/Line";
import { getLineBoundingBox } from "../../../utils/layout/getLineBoundingBox";
import { PowerPointObjectRenderer } from "../types/PowerPointObjectRenderer";
import { getPptxFillColor } from "../utils/getPptxFillColor";
import { getInchesFromPixels, getPptxPixelsFromPixels } from "../utils/getUnitsFromPixels";

export const renderLine: PowerPointObjectRenderer<Line> = ({
  powerpoint,
  slide,
  object: line,
  opacity,
  pixelsPerInch,
  transform,
}) => {
  const targetOpacity = line.opacity * opacity;
  if (line.drawn === 0 || targetOpacity === 0) {
    return;
  }

  const { origin, size } = getLineBoundingBox(
    line.startX + transform.translateX,
    line.startY + transform.translateY,
    line.endX + transform.translateX + transform.scale * (line.endX - line.startX),
    line.endY + transform.translateY + transform.scale * (line.endY - line.startY),
  );

  slide.addShape(powerpoint.ShapeType.line, {
    x: getInchesFromPixels(origin.x, pixelsPerInch),
    y: getInchesFromPixels(origin.y, pixelsPerInch),
    w: getInchesFromPixels(size.width, pixelsPerInch),
    h: getInchesFromPixels(size.height, pixelsPerInch),
    line: {
      ...getPptxFillColor(line.color, targetOpacity),
      width: transform.scale * getPptxPixelsFromPixels(line.width, pixelsPerInch),
    },
    flipH: line.startX > line.endX,
    flipV: line.startY > line.endY,
  });
};
