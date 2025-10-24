import { Alignment, DEFAULT_ALIGNMENT } from "../types/Alignment";
import { Anchor, DEFAULT_ANCHOR } from "../types/Anchor";
import { Animate, AnimationParams } from "../types/Animate";
import { ObjectType } from "../types/ObjectType";
import { SlideObject } from "../types/SlideObject";
import { TextContent } from "../types/TextContent";
import { DEFAULT_TEXT_STYLE, TextStyle } from "../types/TextStyle";
import { getTextContentLength } from "../utils/objects/text/getTextContentLength";

export interface Text extends SlideObject, TextStyle {
  readonly objectType: typeof ObjectType.TEXT;
  readonly alignment: Alignment;
  readonly anchor: Anchor;

  /**
   * The number of characters of the text to show.
   * If `null`, shows all text.
   */
  readonly length: number | null;

  readonly lineSpacing: number;
  readonly text: TextContent;
  readonly x: number;
  readonly y: number;
}

export function Text(
  text: TextContent = "",
  props: Partial<Omit<Text, "objectType" | "text">> | null = null,
): Text {
  return SlideObject({
    objectType: ObjectType.TEXT,
    alignment: DEFAULT_ALIGNMENT,
    anchor: DEFAULT_ANCHOR,
    length: null,
    lineSpacing: 1,
    text,
    x: 0,
    y: 0,
    ...DEFAULT_TEXT_STYLE,
    ...props,
  });
}

Text.writeOn = (text: Text, animationParams: AnimationParams<Text> = {}) =>
  Animate(
    text,
    {
      length: getTextContentLength(text.text),
    },
    animationParams,
  );
