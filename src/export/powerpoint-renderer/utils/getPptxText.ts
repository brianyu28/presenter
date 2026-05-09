import pptxgen from "pptxgenjs";

import { FontStyle } from "../../../types/FontStyle";
import { FontWeight } from "../../../types/FontWeight";
import { TextStyle } from "../../../types/TextStyle";
import { TextUnit } from "../../../types/TextUnit";
import { getTextScriptVariant } from "../../../utils/objects/text/getTextScriptVariant";
import { getPptxFillColor } from "./getPptxFillColor";
import { getPptxFontSizeFromPixels } from "./getUnitsFromPixels";

interface Args {
  readonly length: number | null;
  readonly opacity: number;
  readonly pixelsPerInch: number;
  readonly scale: number;
  readonly style: TextStyle;
  readonly textUnits: readonly TextUnit[][];
}

export function getPptxText({
  length,
  opacity,
  pixelsPerInch,
  scale,
  style,
  textUnits,
}: Args): pptxgen.TextProps[] {
  const textProps: pptxgen.TextProps[] = [];
  let consumedLength = 0;

  for (const line of textUnits) {
    if (textProps.length > 0) {
      textProps.push({ text: "\n" });
    }

    for (const textUnit of line) {
      if (length !== null && consumedLength >= length) {
        break;
      }

      const { text: unitText, ...unitStyle } = textUnit;

      let truncatedUnitText: string | undefined;
      if (length !== null && consumedLength + unitText.length > length) {
        const remainingLength = length - consumedLength;
        truncatedUnitText = unitText.slice(0, remainingLength);
      }

      const targetUnitText = truncatedUnitText ?? unitText;
      consumedLength += targetUnitText.length;

      const combinedStyle: TextStyle = { ...style, ...unitStyle };
      const scriptVariant = getTextScriptVariant(combinedStyle);
      textProps.push({
        text: targetUnitText,
        options: {
          bold: combinedStyle.fontWeight >= FontWeight.BOLD,
          fontFace: combinedStyle.fontFamily,
          fontSize: scale * getPptxFontSizeFromPixels(scriptVariant.fontSize, pixelsPerInch),
          ...getPptxFillColor(combinedStyle.color, opacity),
          italic:
            combinedStyle.fontStyle === FontStyle.ITALIC ||
            combinedStyle.fontStyle === FontStyle.OBLIQUE,
          subscript: scriptVariant.isSubscript,
          superscript: scriptVariant.isSuperscript,
        },
      });
    }
  }
  return textProps;
}
