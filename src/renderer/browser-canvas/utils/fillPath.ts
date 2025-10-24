import { Color } from "../../../types/Color";
import { getRgbStringForColor } from "../../../utils/color/getRgbStringForColor";

interface Args {
  readonly ctx: CanvasRenderingContext2D;
  readonly path: Path2D | undefined;
  readonly color: Color;
  readonly opacity?: number | null;
}

export function fillPath({ ctx, path, color, opacity = null }: Args) {
  ctx.fillStyle = getRgbStringForColor(color, opacity);
  if (path !== undefined) {
    ctx.fill(path);
  } else {
    ctx.fill();
  }
}
