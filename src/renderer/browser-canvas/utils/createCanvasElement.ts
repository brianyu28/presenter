import { Size } from "../../../types/Size";

export function createCanvasElement(size: Size): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("width", size.width.toString());
  canvas.setAttribute("height", size.height.toString());

  canvas.style.width = "100%";

  return canvas;
}
