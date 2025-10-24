import { Size } from "../../types/Size";

/**
 * Computes the combined size of a 2D array of sizes.
 *
 * If a line spacing is provided, it's added
 */
export function getCombinedSizes2D(sizes: Size[][], lineSpacing: number = 1): Size {
  const width = Math.max(...sizes.map((line) => line.reduce((a, b) => a + b.width, 0)));

  let height = 0;
  let previousLineHeight = 0;
  for (let i = 0; i < sizes.length; i++) {
    const line = sizes[i];
    if (line === undefined) {
      continue;
    }

    const lineHeight = Math.max(...line.map((unit) => unit.height));
    height += lineHeight + previousLineHeight * (lineSpacing - 1);
    previousLineHeight = lineHeight;
  }

  return {
    height,
    width,
  };
}
