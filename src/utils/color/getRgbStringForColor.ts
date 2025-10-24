import { Color } from "../../types/Color";
import { getAlphaForColor } from "./getAlphaForColor";

export function getRgbStringForColor(color: Color, opacity: number | null = null): string {
  const { red, green, blue } = color;
  const alpha = getAlphaForColor(color, opacity);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}
