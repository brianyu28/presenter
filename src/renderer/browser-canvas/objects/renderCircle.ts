import { Circle } from "../../../objects/Circle";
import { getCircleInsetFillPath } from "../../../utils/objects/circle/getCircleInsetFillPath";
import { getCirclePath } from "../../../utils/objects/circle/getCirclePath";
import { BrowserCanvasObjectRenderer } from "../types/BrowserCanvasObjectRenderer";
import { clipToPath } from "../utils/clipToPath";
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

  if (targetOpacity < 1 && circle.borderWidth > 0) {
    // Clip fill to an inset path so it doesn't extend under the stroke,
    // avoiding the visual artifact on semi-transparent circles.
    const insetFillPath = getCircleInsetFillPath(circle, createPath2D);
    if (insetFillPath !== undefined) {
      ctx.context.save();
      clipToPath(ctx, insetFillPath);
      fillPath({ ctx, path, color: circle.fill, opacity: targetOpacity });
      ctx.context.restore();
    }
  } else {
    fillPath({ ctx, path, color: circle.fill, opacity: targetOpacity });
  }

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
