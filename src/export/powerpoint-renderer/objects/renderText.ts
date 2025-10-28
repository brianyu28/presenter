import { Text } from "../../../objects/Text";
import { getTextUnitMeasurements } from "../../../renderer/browser-canvas/utils/text/getTextUnitMeasurements";
import { Position } from "../../../types/Position";
import { getTextStyleFromText } from "../../../utils/objects/text/getTextStyleFromText";
import { getTextUnitsFromTextContent } from "../../../utils/objects/text/getTextUnitsFromTextContent";
import { getCombinedSizes2D } from "../../../utils/size/getCombinedSizes2D";
import { PowerPointObjectRenderer } from "../types/PowerPointObjectRenderer";
import { getPptxText } from "../utils/getPptxText";
import { getTransformedBoundingBox } from "../utils/getTransformedBoundingBox";
import { getInchesFromPixels } from "../utils/getUnitsFromPixels";

export const renderText: PowerPointObjectRenderer<Text> = ({
  ctx,
  slide,
  object: text,
  opacity,
  pixelsPerInch,
  transform,
}) => {
  const targetOpacity = text.opacity * opacity;
  if (text.length === 0 || targetOpacity === 0) {
    return;
  }

  const { length } = text;
  const textUnits = getTextUnitsFromTextContent(text.text);
  const style = getTextStyleFromText(text);

  const sizes = getTextUnitMeasurements(textUnits, style, ctx);
  const baseSize = getCombinedSizes2D(sizes, text.lineSpacing);
  const { origin, size } = getTransformedBoundingBox(
    Position({ x: text.x, y: text.y }),
    text.anchor,
    baseSize,
    transform,
  );

  const pptxText = getPptxText({
    length,
    opacity: targetOpacity,
    pixelsPerInch,
    scale: transform.scale,
    style,
    textUnits,
  });

  slide.addText(pptxText, {
    x: getInchesFromPixels(origin.x, pixelsPerInch),
    y: getInchesFromPixels(origin.y, pixelsPerInch),

    // Render text box slightly larger to account for variantion in text rendering
    h: getInchesFromPixels(size.height, pixelsPerInch) * 1.1,
    w: getInchesFromPixels(size.width, pixelsPerInch) * 1.1,
  });
};
