import { Rectangle } from "../../../objects/Rectangle";
import { getRectanglePath } from "../../../utils/objects/rectangle/getRectanglePath";
import { BrowserCanvasObjectRenderer } from "../types/BrowserCanvasObjectRenderer";
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

  fillPath({
    ctx,
    path,
    color: rectangle.fill,
    opacity: targetOpacity,
  });

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
