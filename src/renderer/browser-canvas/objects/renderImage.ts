import { Image } from "../../../objects/Image";
import { Position } from "../../../types/Position";
import { Size } from "../../../types/Size";
import { getBoundingBox } from "../../../utils/layout/getBoundingBox";
import { getRoundedRectanglePath } from "../../../utils/objects/rectangle/getRoundedRectanglePath";
import { BrowserCanvasObjectRenderer } from "../types/BrowserCanvasObjectRenderer";

export const renderImage: BrowserCanvasObjectRenderer<Image> = ({
  ctx,
  imageById,
  object: image,
  opacity,
}) => {
  const boundingBox = getBoundingBox(
    Position({ x: image.x, y: image.y }),
    image.anchor,
    Size({ width: image.width, height: image.height }),
  );

  const imageElement = imageById[image.imageId];
  if (imageElement === undefined) {
    return;
  }

  ctx.save();

  if (image.rounding > 0) {
    const roundedRectPath = getRoundedRectanglePath(
      boundingBox.origin,
      boundingBox.size,
      image.rounding,
    );
    ctx.clip(roundedRectPath.path);
  }

  ctx.globalAlpha = opacity * image.opacity;
  ctx.imageSmoothingEnabled = image.smooth;
  ctx.drawImage(
    imageElement,
    boundingBox.origin.x,
    boundingBox.origin.y,
    boundingBox.size.width,
    boundingBox.size.height,
  );

  // Restore opacity state
  ctx.restore();
};
