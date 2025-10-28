import { Arrow } from "../../../objects/Arrow";
import { getLineBoundingBox } from "../../../utils/layout/getLineBoundingBox";
import { PowerPointObjectRenderer } from "../types/PowerPointObjectRenderer";
import { getPptxFillColor } from "../utils/getPptxFillColor";
import { getInchesFromPixels, getPptxPixelsFromPixels } from "../utils/getUnitsFromPixels";

export const renderArrow: PowerPointObjectRenderer<Arrow> = ({
  powerpoint,
  slide,
  object: arrow,
  opacity,
  pixelsPerInch,
  transform,
}) => {
  const targetOpacity = arrow.opacity * opacity;
  if (arrow.drawn === 0 || targetOpacity === 0) {
    return;
  }

  const { origin, size } = getLineBoundingBox(
    arrow.startX + transform.translateX,
    arrow.startY + transform.translateY,
    arrow.endX + transform.translateX + transform.scale * (arrow.endX - arrow.startX),
    arrow.endY + transform.translateY + transform.scale * (arrow.endY - arrow.startY),
  );

  slide.addShape(powerpoint.ShapeType.line, {
    x: getInchesFromPixels(origin.x, pixelsPerInch),
    y: getInchesFromPixels(origin.y, pixelsPerInch),
    w: getInchesFromPixels(size.width, pixelsPerInch),
    h: getInchesFromPixels(size.height, pixelsPerInch),
    line: {
      ...getPptxFillColor(arrow.color, targetOpacity),
      width: getPptxPixelsFromPixels(arrow.width, pixelsPerInch),
      beginArrowType: arrow.isArrowheadDoubled ? "triangle" : "none",
      endArrowType: "triangle",
    },
    flipH: arrow.startX > arrow.endX,
    flipV: arrow.startY > arrow.endY,
  });
};
