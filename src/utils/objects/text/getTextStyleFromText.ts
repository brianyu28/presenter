import { Text } from "../../../objects/Text";
import { TextStyle } from "../../../types/TextStyle";

export function getTextStyleFromText(text: Text): TextStyle {
  return {
    color: text.color,
    fontFamily: text.fontFamily,
    fontSize: text.fontSize,
    fontStyle: text.fontStyle,
    fontWeight: text.fontWeight,
    // Text-generating libraries created before letterSpacing was introduced might omit
    // this property, even though current TS type requires it.
    letterSpacing: text.letterSpacing ?? 1,
    ligatures: text.ligatures,
    subscript: text.subscript,
    superscript: text.superscript,
  };
}
