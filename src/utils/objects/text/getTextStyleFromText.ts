import { Text } from "../../../objects/Text";
import { TextStyle } from "../../../types/TextStyle";

export function getTextStyleFromText(text: Text): TextStyle {
  return {
    color: text.color,
    fontFamily: text.fontFamily,
    fontSize: text.fontSize,
    fontStyle: text.fontStyle,
    fontWeight: text.fontWeight,
    ligatures: text.ligatures,
  };
}
