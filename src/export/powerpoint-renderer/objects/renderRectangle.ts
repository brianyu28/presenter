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
    rectangle.rounding > 0 ? powerpoint.ShapeType.roundRect : powerpoint.ShapeType.rect,
    {
      fill: getPptxFillColor(rectangle.fill, targetOpacity),
      x: getInchesFromPixels(origin.x, pixelsPerInch),
      y: getInchesFromPixels(origin.y, pixelsPerInch),
      w: getInchesFromPixels(size.width, pixelsPerInch),
      h: getInchesFromPixels(size.height, pixelsPerInch),
      line:
        rectangle.borderWidth > 0
          ? {
              ...getPptxFillColor(rectangle.borderColor, targetOpacity),
              width: getPptxPixelsFromPixels(
                rectangle.borderWidth * transform.scale,
                pixelsPerInch,
              ),
            }
          : {},
      rectRadius:
        rectangle.rounding > 0 ? (transform.scale * rectangle.rounding) / rectangle.height : 0,
    },
  );
};
