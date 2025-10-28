import { Circle } from "../../../objects/Circle";
import { Position } from "../../../types/Position";
import { Size } from "../../../types/Size";
import { PowerPointObjectRenderer } from "../types/PowerPointObjectRenderer";
import { getPptxFillColor } from "../utils/getPptxFillColor";
import { getTransformedBoundingBox } from "../utils/getTransformedBoundingBox";
import { getInchesFromPixels, getPptxPixelsFromPixels } from "../utils/getUnitsFromPixels";

export const renderCircle: PowerPointObjectRenderer<Circle> = ({
  powerpoint,
  slide,
  object: circle,
  opacity,
  pixelsPerInch,
  transform,
}) => {
  const targetOpacity = circle.opacity * opacity;
  if (circle.drawn === 0 || targetOpacity === 0) {
    return;
  }

  const { origin, size } = getTransformedBoundingBox(
    Position({ x: circle.x, y: circle.y }),
    circle.anchor,
    Size({ width: circle.radius * 2, height: circle.radius * 2 }),
    transform,
  );

  slide.addShape(powerpoint.ShapeType.ellipse, {
    fill: getPptxFillColor(circle.fill, targetOpacity),
    x: getInchesFromPixels(origin.x, pixelsPerInch),
    y: getInchesFromPixels(origin.y, pixelsPerInch),
    w: getInchesFromPixels(size.width, pixelsPerInch),
    h: getInchesFromPixels(size.height, pixelsPerInch),
    line:
      circle.borderWidth > 0
        ? {
            ...getPptxFillColor(circle.borderColor, targetOpacity),
            width: getPptxPixelsFromPixels(transform.scale * circle.borderWidth, pixelsPerInch),
          }
        : undefined,
  });
};
