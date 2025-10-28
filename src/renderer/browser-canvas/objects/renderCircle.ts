import { Circle } from "../../../objects/Circle";
import { getCirclePath } from "../../../utils/objects/circle/getCirclePath";
import { BrowserCanvasObjectRenderer } from "../types/BrowserCanvasObjectRenderer";
import { drawStroke } from "../utils/drawStroke";
import { fillPath } from "../utils/fillPath";

export const renderCircle: BrowserCanvasObjectRenderer<Circle> = ({
  ctx,
  object: circle,
  opacity,
  createPath2D,
}) => {
  const targetOpacity = circle.opacity * opacity;
  if (targetOpacity === 0 || (circle.drawn === 0 && circle.fill.alpha === 0)) {
    return;
  }

  const { path, length } = getCirclePath(circle, createPath2D);

  fillPath({
    ctx,
    path,
    color: circle.fill,
    opacity: targetOpacity,
  });

  drawStroke({
    color: circle.borderColor,
    ctx,
    drawn: circle.drawn,
    path,
    pathLength: length,
    opacity: targetOpacity,
    width: circle.borderWidth,
  });
};
