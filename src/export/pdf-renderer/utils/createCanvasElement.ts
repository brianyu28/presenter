import { Canvas } from "skia-canvas";

import { Size } from "../../../types/Size";

export function createCanvasElement(size: Size): Canvas {
  const canvas = new Canvas(size.width, size.height);
  return canvas;
}
