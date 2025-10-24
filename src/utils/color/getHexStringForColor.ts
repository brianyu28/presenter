import { Color } from "../../types/Color";
import { getAlphaForColor } from "./getAlphaForColor";

export function getHexStringForColor(color: Color, opacity: number | null = null): string {
  const { red, green, blue } = color;
  const hex = (red << 16) | (green << 8) | blue;
  const alphaHex = Math.round(getAlphaForColor(color, opacity) * 255);
  return `#${hex.toString(16).padStart(6, "0")}${alphaHex !== 255 ? alphaHex.toString(16).padStart(2, "0") : ""}`;
}
