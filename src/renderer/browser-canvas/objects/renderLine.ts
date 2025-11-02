import { Line } from "../../../objects/Line";
import { getLinePath } from "../../../utils/objects/line/getLinePath";
import { BrowserCanvasObjectRenderer } from "../types/BrowserCanvasObjectRenderer";
import { drawStroke } from "../utils/drawStroke";

export const renderLine: BrowserCanvasObjectRenderer<Line> = ({
  ctx,
  object: line,
  opacity,
  createPath2D,
}) => {
  const targetOpacity = line.opacity * opacity;
  if (targetOpacity === 0 || line.drawn === 0) {
    return;
  }

  const { path, length } = getLinePath(line, createPath2D);

  drawStroke({
    color: line.color,
    ctx,
    drawn: line.drawn,
    isDrawnFromCenter: line.isDrawnFromCenter,
    isRounded: line.isRounded,
    path,
    pathLength: length,
    opacity: targetOpacity,
    width: line.width,
  });
};
