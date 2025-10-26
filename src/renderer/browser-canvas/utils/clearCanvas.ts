import { UnifiedCanvasContext } from "../types/UnifiedCanvasContext";

export function clearCanvas(canvas: HTMLCanvasElement, ctx: UnifiedCanvasContext): void {
  ctx.context.clearRect(0, 0, canvas.width, canvas.height);
}
