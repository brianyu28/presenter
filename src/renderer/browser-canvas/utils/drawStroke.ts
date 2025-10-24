import { Color } from "../../../types/Color";
import { getHexStringForColor } from "../../../utils/color/getHexStringForColor";

interface Args {
  readonly color: Color;
  readonly ctx: CanvasRenderingContext2D;
  readonly drawn?: number | null;
  readonly isDrawnFromCenter?: boolean;
  readonly opacity?: number | null;
  readonly path: Path2D | undefined;
  readonly pathLength?: number | null;
  readonly width: number;
}

export function drawStroke({
  ctx,
  color,
  drawn = null,
  isDrawnFromCenter = false,
  opacity = null,
  path,
  pathLength = null,
  width,
}: Args) {
  if (width === 0 || drawn === 0) {
    return;
  }

  if (drawn !== null && pathLength !== null && drawn !== 1) {
    const drawnLength = pathLength * drawn;
    if (!isDrawnFromCenter) {
      ctx.setLineDash([drawnLength, pathLength - drawnLength]);
    } else {
      ctx.setLineDash([
        0,
        (pathLength - drawnLength) / 2,
        drawnLength,
        (pathLength - drawnLength) / 2,
      ]);
    }
  } else {
    ctx.setLineDash([]);
  }

  ctx.lineWidth = width;
  ctx.strokeStyle = getHexStringForColor(color, opacity);
  if (path !== undefined) {
    ctx.stroke(path);
  } else {
    ctx.stroke();
  }
}
