import { Position } from "../../types/Position";
import { Size } from "../../types/Size";

interface Return {
  scaleX: (proportion: number) => number;
  scaleY: (proportion: number) => number;
  position: (xProportion: number, yProportion: number) => Position;
}

/** Returns sizing functions for calculating proportional sizes. */
export function getSizingFunctions(size: Size): Return {
  const scaleX = (proportion: number) => size.width * proportion;
  const scaleY = (proportion: number) => size.height * proportion;

  return {
    scaleX,
    scaleY,
    position: (xProportion: number, yProportion: number) =>
      Position({
        x: scaleX(xProportion),
        y: scaleY(yProportion),
      }),
  };
}
