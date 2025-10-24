import { Path } from "../../../objects/Path";
import { Position } from "../../../types/Position";
import { Size } from "../../../types/Size";
import { getBoundingBox } from "../../../utils/layout/getBoundingBox";
import { BrowserCanvasObjectRenderer } from "../types/BrowserCanvasObjectRenderer";
import { drawStroke } from "../utils/drawStroke";
import { fillPath } from "../utils/fillPath";

export const renderPath: BrowserCanvasObjectRenderer<Path> = ({ ctx, object: path, opacity }) => {
  const { origin } = getBoundingBox(
    Position({ x: path.x, y: path.y }),
    path.anchor,
    Size({ width: path.width, height: path.height }),
  );
  const path2D = new Path2D(path.path);

  ctx.save();
  ctx.translate(origin.x, origin.y);

  fillPath({
    ctx,
    path: path2D,
    color: path.fill,
    opacity: path.opacity * opacity,
  });

  drawStroke({
    color: path.color,
    ctx,
    drawn: path.drawn,
    path: path2D,
    pathLength: path.pathLength,
    opacity: path.opacity * opacity,
    width: path.strokeWidth,
  });

  // Undo transformations
  ctx.restore();
};
