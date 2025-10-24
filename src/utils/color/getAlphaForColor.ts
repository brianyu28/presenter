import { Color } from "../../types/Color";

/**
 * Returns the alpha value for a color in [0, 1], given the color and the overall opacity of a shape.
 * Combines the color's alpha and the overall opacity.
 */
export function getAlphaForColor(color: Color, opacity: number | null = null): number {
  return color.alpha * (opacity ?? 1);
}
