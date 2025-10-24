export function clearCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
