import { Rectangle } from "../../../objects/Rectangle";
import { Position } from "../../../types/Position";
import { Size } from "../../../types/Size";
import { PowerPointObjectRenderer } from "../types/PowerPointObjectRenderer";
import { getPptxFillColor } from "../utils/getPptxFillColor";
import { getTransformedBoundingBox } from "../utils/getTransformedBoundingBox";
import { getInchesFromPixels, getPptxPixelsFromPixels } from "../utils/getUnitsFromPixels";

export const renderRectangle: PowerPointObjectRenderer<Rectangle> = ({
  powerpoint,
  slide,
  object: rectangle,
  opacity,
  pixelsPerInch,
  transform,
}) => {
  const targetOpacity = rectangle.opacity * opacity;
  if (rectangle.drawn === 0 || targetOpacity === 0) {
    return;
  }

  const { origin, size } = getTransformedBoundingBox(
    Position({ x: rectangle.x, y: rectangle.y }),
    rectangle.anchor,
    Size({ width: rectangle.width, height: rectangle.height }),
    transform,
  );

  slide.addShape(
    rectangle.cornerRadius > 0 ? powerpoint.ShapeType.roundRect : powerpoint.ShapeType.rect,
    {
      fill: getPptxFillColor(rectangle.fillColor, targetOpacity),
      x: getInchesFromPixels(origin.x, pixelsPerInch),
      y: getInchesFromPixels(origin.y, pixelsPerInch),
      w: getInchesFromPixels(size.width, pixelsPerInch),
      h: getInchesFromPixels(size.height, pixelsPerInch),
      line:
        rectangle.strokeWidth > 0
          ? {
              ...getPptxFillColor(rectangle.strokeColor, targetOpacity),
              width: getPptxPixelsFromPixels(
                rectangle.strokeWidth * transform.scale,
                pixelsPerInch,
              ),
            }
          : {},
      rectRadius:
        rectangle.cornerRadius > 0
          ? (transform.scale * rectangle.cornerRadius) / rectangle.height
          : 0,
    },
  );
};
