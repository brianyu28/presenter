import { Text } from "../../../objects/Text";
import { Alignment } from "../../../types/Alignment";
import { Position } from "../../../types/Position";
import { TextStyle } from "../../../types/TextStyle";
import { assertNever } from "../../../utils/core/assertNever";
import { getBoundingBox } from "../../../utils/layout/getBoundingBox";
import { getTextStyleFromText } from "../../../utils/objects/text/getTextStyleFromText";
import { getTextUnitsFromTextContent } from "../../../utils/objects/text/getTextUnitsFromTextContent";
import { BrowserCanvasObjectRenderer } from "../types/BrowserCanvasObjectRenderer";
import { getTextLayout } from "../utils/text/getTextLayout";
import { getTextUnitMeasurements } from "../utils/text/getTextUnitMeasurements";
import { setContextWithTextStyle } from "../utils/text/setContextWithTextStyle";

export const renderText: BrowserCanvasObjectRenderer<Text> = ({ ctx, object: text, opacity }) => {
  const targetOpacity = text.opacity * opacity;
  if (targetOpacity === 0) {
    return;
  }

  const { length } = text;
  const textUnits = getTextUnitsFromTextContent(text.text);
  const style = getTextStyleFromText(text);

  const sizes = getTextUnitMeasurements(textUnits, style, ctx);
  const layout = getTextLayout(sizes, text.lineSpacing);
  const boundingBox = getBoundingBox(Position({ x: text.x, y: text.y }), text.anchor, layout.size);

  let x = boundingBox.origin.x;
  let consumedLength = 0;

  for (let lineIndex = 0; lineIndex < textUnits.length; lineIndex++) {
    const line = textUnits[lineIndex];
    const lineSizes = sizes[lineIndex];
    const lineLayout = layout.lines[lineIndex];

    if (line == undefined || lineSizes == undefined || lineLayout == undefined) {
      console.error("Could not determine text units or sizes for line");
      continue;
    }

    const lineWidth = lineSizes.reduce((acc, curr) => acc + curr.width, 0);

    switch (text.alignment) {
      case Alignment.LEFT:
        x = boundingBox.origin.x;
        break;
      case Alignment.CENTER:
        x = boundingBox.origin.x + (boundingBox.size.width - lineWidth) / 2;
        break;
      case Alignment.RIGHT:
        x = boundingBox.origin.x + (boundingBox.size.width - lineWidth);
        break;
      default:
        assertNever(text.alignment);
        break;
    }
    const baselineY = boundingBox.origin.y + lineLayout.baselineY;

    for (let unitIndex = 0; unitIndex < line.length; unitIndex++) {
      if (length !== null && consumedLength >= length) {
        break;
      }

      const unit = line[unitIndex];
      const unitSize = lineSizes[unitIndex];

      if (unit == undefined || unitSize == undefined) {
        console.error("Could not determine text unit or size for unit");
        continue;
      }

      const { text: unitText, ...unitStyle } = unit;

      let truncatedUnitText: string | undefined;
      if (length !== null && consumedLength + unitText.length > length) {
        const remainingLength = length - consumedLength;
        truncatedUnitText = unitText.slice(0, remainingLength);
      }
      const targetUnitText = truncatedUnitText ?? unitText;
      consumedLength += targetUnitText.length;

      const combinedStyle: TextStyle = { ...style, ...unitStyle };
      setContextWithTextStyle(ctx, combinedStyle, targetOpacity);
      ctx.context.fillText(targetUnitText, x, baselineY + unitSize.baselineShift);
      x += unitSize.width;
    }
  }
};
