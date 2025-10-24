import { TextContent } from "../../../types/TextContent";
import { TextUnit } from "../../../types/TextUnit";

export function getTextUnitsFromTextContent(text: TextContent): TextUnit[][] {
  if (typeof text === "string") {
    return [[{ text }]];
  }
  return text.map((line) => line.map((unit) => (typeof unit === "string" ? { text: unit } : unit)));
}
