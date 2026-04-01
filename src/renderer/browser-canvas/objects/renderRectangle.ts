import { Rectangle } from "../../../objects/Rectangle";
import { getRectangleInsetFillPath } from "../../../utils/objects/rectangle/getRectangleInsetFillPath";
import { getRectanglePath } from "../../../utils/objects/rectangle/getRectanglePath";
import { BrowserCanvasObjectRenderer } from "../types/BrowserCanvasObjectRenderer";
import { clipToPath } from "../utils/clipToPath";
import { drawStroke } from "../utils/drawStroke";
import { fillPath } from "../utils/fillPath";

export const renderRectangle: BrowserCanvasObjectRenderer<Rectangle> = ({
  ctx,
  object: rectangle,
  opacity,
  createPath2D,
}) => {
  const targetOpacity = rectangle.opacity * opacity;
  if (targetOpacity === 0 || (rectangle.drawn === 0 && rectangle.fill.alpha === 0)) {
    return;
  }

  const { path, length } = getRectanglePath(rectangle, createPath2D);

  if (targetOpacity < 1 && rectangle.borderWidth > 0) {
    // Clip fill to an inset path so it doesn't extend under the stroke.
    const insetFillPath = getRectangleInsetFillPath(rectangle, createPath2D);
    if (insetFillPath !== undefined) {
      ctx.context.save();
      clipToPath(ctx, insetFillPath);
      fillPath({ ctx, path, color: rectangle.fill, opacity: targetOpacity });
      ctx.context.restore();
    }
  } else {
    fillPath({ ctx, path, color: rectangle.fill, opacity: targetOpacity });
  }

  drawStroke({
    color: rectangle.borderColor,
    ctx,
    drawn: rectangle.drawn,
    path,
    pathLength: length,
    opacity: targetOpacity,
    width: rectangle.borderWidth,
  });
};
