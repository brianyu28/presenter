import { Image } from "../../../objects/Image";
import { Position } from "../../../types/Position";
import { Size } from "../../../types/Size";
import { assertNever } from "../../../utils/core/assertNever";
import { getBoundingBox } from "../../../utils/layout/getBoundingBox";
import { getRoundedRectanglePath } from "../../../utils/objects/rectangle/getRoundedRectanglePath";
import { BrowserCanvasObjectRenderer } from "../types/BrowserCanvasObjectRenderer";
import { CanvasContextType } from "../types/UnifiedCanvasContext";
import { ImageType } from "../types/UnifiedImage";
import { Path2DType } from "../types/UnifiedPath2D";

export const renderImage: BrowserCanvasObjectRenderer<Image> = ({
  ctx,
  imageById,
  object: image,
  opacity,
  createPath2D,
}) => {
  const boundingBox = getBoundingBox(
    Position({ x: image.x, y: image.y }),
    image.anchor,
    Size({ width: image.width, height: image.height }),
  );

  const imageData = imageById[image.imageId];
  if (imageData === undefined) {
    return;
  }

  ctx.context.save();

  if (image.rounding > 0) {
    const roundedRectPath = getRoundedRectanglePath(
      boundingBox.origin,
      boundingBox.size,
      image.rounding,
      createPath2D,
    );

    switch (ctx.type) {
      case CanvasContextType.Browser:
        if (roundedRectPath.path.type === Path2DType.Browser) {
          ctx.context.clip(roundedRectPath.path.path);
        } else {
          console.warn("Attempted to use Node Path2D in Browser Canvas context");
        }
        break;
      case CanvasContextType.Node:
        if (roundedRectPath.path.type === Path2DType.Node) {
          ctx.context.clip(roundedRectPath.path.path);
        } else {
          console.warn("Attempted to use Browser Path2D in Node Canvas context");
        }
        break;
      default:
        assertNever(ctx);
    }
  }

  ctx.context.globalAlpha = opacity * image.opacity;
  ctx.context.imageSmoothingEnabled = image.smooth;

  switch (ctx.type) {
    case CanvasContextType.Browser:
      if (imageData.type === ImageType.Browser) {
        ctx.context.drawImage(
          imageData.image,
          boundingBox.origin.x,
          boundingBox.origin.y,
          boundingBox.size.width,
          boundingBox.size.height,
        );
      } else {
        console.warn("Attempted to use Node Image in Browser Canvas context");
      }
      break;
    case CanvasContextType.Node:
      if (imageData.type === ImageType.Node) {
        ctx.context.drawImage(
          imageData.image,
          boundingBox.origin.x,
          boundingBox.origin.y,
          boundingBox.size.width,
          boundingBox.size.height,
        );
      } else {
        console.warn("Attempted to use Browser Image in Node Canvas context");
      }
      break;
    default:
      assertNever(ctx);
  }

  // Restore opacity state
  ctx.context.restore();
};
