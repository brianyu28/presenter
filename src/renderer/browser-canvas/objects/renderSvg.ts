import { SVG } from "../../../objects/SVG";
import { Position } from "../../../types/Position";
import { Size } from "../../../types/Size";
import { assertNever } from "../../../utils/core/assertNever";
import { getBoundingBox } from "../../../utils/layout/getBoundingBox";
import { BrowserCanvasObjectRenderer } from "../types/BrowserCanvasObjectRenderer";
import { CanvasContextType } from "../types/UnifiedCanvasContext";
import { ImageType } from "../types/UnifiedImage";

export const renderSvg: BrowserCanvasObjectRenderer<SVG> = ({
  ctx,
  imageById,
  object: svg,
  opacity,
}) => {
  const targetOpacity = svg.opacity * opacity;
  if (targetOpacity === 0 || !svg.svg) {
    return;
  }

  const imageData = imageById[svg.svg];
  if (imageData === undefined) {
    return;
  }

  const boundingBox = getBoundingBox(
    Position({ x: svg.x, y: svg.y }),
    svg.anchor,
    Size({ width: svg.width, height: svg.height }),
  );

  ctx.context.save();
  ctx.context.globalAlpha = targetOpacity;

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
      }
      break;
    default:
      assertNever(ctx);
  }

  ctx.context.restore();
};
