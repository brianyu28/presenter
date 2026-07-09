import { Color } from "../../types/Color";

export function colorToThreeHex(color: Color): number {
  return (color.red << 16) + (color.green << 8) + color.blue;
}
