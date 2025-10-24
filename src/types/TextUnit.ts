import { TextStyle } from "./TextStyle";

/** A possibly styled piece of text inside of a text object. */
export interface TextUnit extends Partial<TextStyle> {
  readonly text: string;
}

export function TextUnit(text: string, props: Partial<Omit<TextUnit, "text">> = {}): TextUnit {
  return {
    ...props,
    text,
  };
}
