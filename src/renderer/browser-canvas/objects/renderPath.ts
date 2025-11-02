import { Path } from "../../../objects/Path";
import { Position } from "../../../types/Position";
import { Size } from "../../../types/Size";
import { getBoundingBox } from "../../../utils/layout/getBoundingBox";
import { BrowserCanvasObjectRenderer } from "../types/BrowserCanvasObjectRenderer";
import { drawStroke } from "../utils/drawStroke";
import { fillPath } from "../utils/fillPath";

export const renderPath: BrowserCanvasObjectRenderer<Path> = ({
  ctx,
  object: path,
  opacity,
  createPath2D,
}) => {
  const targetOpacity = path.opacity * opacity;
  if (targetOpacity === 0 || (path.drawn === 0 && path.fill.alpha === 0)) {
    return;
  }

  const { origin } = getBoundingBox(
    Position({ x: path.x, y: path.y }),
    path.anchor,
    Size({ width: path.width, height: path.height }),
  );
  const path2D = createPath2D(path.path);

  ctx.context.save();
  ctx.context.translate(origin.x, origin.y);
  ctx.context.scale(path.width / path.viewboxWidth, path.height / path.viewboxHeight);

  fillPath({
    ctx,
    path: path2D,
    color: path.fill,
    opacity: targetOpacity,
  });

  drawStroke({
    color: path.color,
    ctx,
    drawn: path.drawn,
    path: path2D,
    pathLength: path.pathLength,
    opacity: targetOpacity,
    width: path.strokeWidth,
  });

  // Undo transformations
  ctx.context.restore();
};
