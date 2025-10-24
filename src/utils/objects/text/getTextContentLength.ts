import { TextContent } from "../../../types/TextContent";
import { getTextUnitsFromTextContent } from "./getTextUnitsFromTextContent";

export function getTextContentLength(text: TextContent): number {
  const units = getTextUnitsFromTextContent(text);
  return units.reduce(
    (totalLength, line) =>
      totalLength + line.reduce((lineLength, unit) => lineLength + unit.text.length, 0),
    0,
  );
}
