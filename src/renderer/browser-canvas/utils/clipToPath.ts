import { assertNever } from "../../../utils/core/assertNever";
import { CanvasContextType, UnifiedCanvasContext } from "../types/UnifiedCanvasContext";
import { Path2DType, UnifiedPath2D } from "../types/UnifiedPath2D";

/**
 * Clips the canvas context to the interior of the given path.
 * Must be called between ctx.context.save() and ctx.context.restore().
 */
export function clipToPath(ctx: UnifiedCanvasContext, path: UnifiedPath2D): void {
  switch (ctx.type) {
    case CanvasContextType.Browser:
      if (path.type === Path2DType.Browser) {
        ctx.context.clip(path.path);
      } else {
        console.warn("Attempted to use Node Path2D in Browser Canvas context");
      }
      break;
    case CanvasContextType.Node:
      if (path.type === Path2DType.Node) {
        ctx.context.clip(path.path);
      } else {
        console.warn("Attempted to use Browser Path2D in Node Canvas context");
      }
      break;
    default:
      assertNever(ctx);
  }
}
