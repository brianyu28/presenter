import { Image } from "../../../objects/Image";
import { Position } from "../../../types/Position";
import { Size } from "../../../types/Size";
import { PowerPointObjectRenderer } from "../types/PowerPointObjectRenderer";
import { getTransformedBoundingBox } from "../utils/getTransformedBoundingBox";
import { getInchesFromPixels } from "../utils/getUnitsFromPixels";

export const renderImage: PowerPointObjectRenderer<Image> = ({
  imagePathById,
  slide,
  object: image,
  opacity,
  pixelsPerInch,
  transform,
}) => {
  const targetOpacity = image.opacity * opacity;
  if (targetOpacity === 0) {
    return;
  }

  const path = imagePathById[image.imageId];
  if (path === undefined) {
    return;
  }

  const { origin, size } = getTransformedBoundingBox(
    Position({ x: image.x, y: image.y }),
    image.anchor,
    Size({ width: image.width, height: image.height }),
    transform,
  );

  slide.addImage({
    path,
    x: getInchesFromPixels(origin.x, pixelsPerInch),
    y: getInchesFromPixels(origin.y, pixelsPerInch),
    w: getInchesFromPixels(size.width, pixelsPerInch),
    h: getInchesFromPixels(size.height, pixelsPerInch),
    transparency: (1 - targetOpacity) * 100,
  });
};
