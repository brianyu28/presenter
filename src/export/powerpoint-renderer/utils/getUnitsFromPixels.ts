/** PowerPoint file assumes 96 pixels per inch. */
const POWERPOINT_PIXELS_PER_INCH = 96;
const POWERPOINT_FONT_SIZE_SCALE = 69;

/**
 * Gets inches from pixels.
 */
export function getInchesFromPixels(pixels: number, pixelsPerInch: number): number {
  return pixels / pixelsPerInch;
}

/**
 * Gets PowerPoint pixels from Presenter.js pixels.
 */
export function getPptxPixelsFromPixels(pixels: number, pixelsPerInch: number): number {
  return getInchesFromPixels(pixels, pixelsPerInch) * POWERPOINT_PIXELS_PER_INCH;
}

export function getPptxFontSizeFromPixels(pixels: number, pixelsPerInch: number): number {
  return getInchesFromPixels(pixels, pixelsPerInch) * POWERPOINT_FONT_SIZE_SCALE;
}
