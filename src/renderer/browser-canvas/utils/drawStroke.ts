import { Color } from "../../../types/Color";
import { getHexStringForColor } from "../../../utils/color/getHexStringForColor";
import { assertNever } from "../../../utils/core/assertNever";
import { CanvasContextType, UnifiedCanvasContext } from "../types/UnifiedCanvasContext";
import { Path2DType, UnifiedPath2D } from "../types/UnifiedPath2D";

interface Args {
  readonly color: Color;
  readonly ctx: UnifiedCanvasContext;
  readonly drawn?: number | null;
  readonly isDrawnFromCenter?: boolean;
  readonly isRounded?: boolean;
  readonly opacity?: number | null;
  readonly path: UnifiedPath2D | undefined;
  readonly pathLength?: number | null;
  readonly width: number;
}

export function drawStroke({
  ctx,
  color,
  drawn = null,
  isDrawnFromCenter = false,
  isRounded = false,
  opacity = null,
  path,
  pathLength = null,
  width,
}: Args) {
  if (width === 0 || drawn === 0) {
    return;
  }

  if (drawn !== null && pathLength !== null && drawn !== 1) {
    const fullPathLength = pathLength + (isRounded ? width : 0);
    const drawnLength = pathLength * drawn;
    if (!isDrawnFromCenter) {
      ctx.context.setLineDash([drawnLength, fullPathLength - drawnLength]);
    } else {
      ctx.context.setLineDash([
        0,
        (fullPathLength - drawnLength) / 2,
        drawnLength,
        (fullPathLength - drawnLength) / 2,
      ]);
    }
  } else {
    ctx.context.setLineDash([]);
  }

  ctx.context.lineWidth = width;
  ctx.context.strokeStyle = getHexStringForColor(color, opacity);
  ctx.context.lineCap = isRounded ? "round" : "butt";

  if (path === undefined) {
    ctx.context.stroke();
    return;
  }

  switch (ctx.type) {
    case CanvasContextType.Browser:
      if (path.type === Path2DType.Browser) {
        ctx.context.stroke(path.path);
      } else {
        console.warn("Attempted to use Node Path2D in Browser Canvas context");
      }
      break;
    case CanvasContextType.Node:
      if (path.type === Path2DType.Node) {
        ctx.context.stroke(path.path);
      } else {
        console.warn("Attempted to use Browser Path2D in Node Canvas context");
      }
      break;
    default:
      assertNever(ctx);
  }
}
