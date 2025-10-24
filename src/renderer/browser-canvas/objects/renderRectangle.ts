import { Rectangle } from "../../../objects/Rectangle";
import { getRectanglePath } from "../../../utils/objects/rectangle/getRectanglePath";
import { BrowserCanvasObjectRenderer } from "../types/BrowserCanvasObjectRenderer";
import { drawStroke } from "../utils/drawStroke";
import { fillPath } from "../utils/fillPath";

export const renderRectangle: BrowserCanvasObjectRenderer<Rectangle> = ({
  ctx,
  object: rectangle,
  opacity,
}) => {
  const { path, length } = getRectanglePath(rectangle);

  fillPath({
    ctx,
    path,
    color: rectangle.fill,
    opacity: rectangle.opacity * opacity,
  });

  drawStroke({
    color: rectangle.borderColor,
    ctx,
    drawn: rectangle.drawn,
    path,
    pathLength: length,
    opacity: rectangle.opacity * opacity,
    width: rectangle.borderWidth,
  });
};
