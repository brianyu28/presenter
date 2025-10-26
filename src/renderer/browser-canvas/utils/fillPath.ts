import { Color } from "../../../types/Color";
import { getRgbStringForColor } from "../../../utils/color/getRgbStringForColor";
import { assertNever } from "../../../utils/core/assertNever";
import { CanvasContextType, UnifiedCanvasContext } from "../types/UnifiedCanvasContext";
import { Path2DType, UnifiedPath2D } from "../types/UnifiedPath2D";

interface Args {
  readonly ctx: UnifiedCanvasContext;
  readonly path: UnifiedPath2D | undefined;
  readonly color: Color;
  readonly opacity?: number | null;
}

export function fillPath({ ctx, path, color, opacity = null }: Args) {
  ctx.context.fillStyle = getRgbStringForColor(color, opacity);

  if (path === undefined) {
    ctx.context.fill();
    return;
  }

  switch (ctx.type) {
    case CanvasContextType.Browser:
      if (path.type === Path2DType.Browser) {
        ctx.context.fill(path.path);
      } else {
        console.warn("Attempted to use Node Path2D in Browser Canvas context");
      }
      break;
    case CanvasContextType.Node:
      if (path.type === Path2DType.Node) {
        ctx.context.fill(path.path);
      } else {
        console.warn("Attempted to use Browser Path2D in Node Canvas context");
      }
      break;
    default:
      assertNever(ctx);
  }
}
