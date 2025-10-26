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
  const { path, length } = getCirclePath(circle, createPath2D);

  fillPath({
    ctx,
    path,
    color: circle.fill,
    opacity: circle.opacity * opacity,
  });

  drawStroke({
    color: circle.borderColor,
    ctx,
    drawn: circle.drawn,
    path,
    pathLength: length,
    opacity: circle.opacity * opacity,
    width: circle.borderWidth,
  });
};
