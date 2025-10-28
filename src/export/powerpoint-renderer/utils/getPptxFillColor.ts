import { Color } from "../../../types/Color";

interface Return {
  /** RGB hex string for color, of length 6 */
  readonly color: string;

  /** Color opacity in [0, 100] */
  readonly transparency: number;
}

export function getPptxFillColor(color: Color, opacity: number = 1): Return {
  const { red, green, blue } = color;
  const hex = (red << 16) | (green << 8) | blue;
  const hexString = `#${hex.toString(16).padStart(6, "0")}`;

  return {
    color: hexString,
    transparency: 100 - opacity * color.alpha * 100,
  };
}
