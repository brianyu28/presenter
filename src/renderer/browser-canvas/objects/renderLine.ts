import { Line } from "../../../objects/Line";
import { getLinePath } from "../../../utils/objects/line/getLinePath";
import { BrowserCanvasObjectRenderer } from "../types/BrowserCanvasObjectRenderer";
import { drawStroke } from "../utils/drawStroke";

export const renderLine: BrowserCanvasObjectRenderer<Line> = ({ ctx, object: line, opacity }) => {
  const { path, length } = getLinePath(line);

  drawStroke({
    color: line.color,
    ctx,
    drawn: line.drawn,
    isDrawnFromCenter: line.isDrawnFromCenter,
    path,
    pathLength: length,
    opacity: line.opacity * opacity,
    width: line.width,
  });
};
