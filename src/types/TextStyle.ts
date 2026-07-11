import { Color, DEFAULT_COLOR } from "./Color";
import { DEFAULT_FONT_STYLE, FontStyle } from "./FontStyle";
import { DEFAULT_FONT_WEIGHT, FontWeight } from "./FontWeight";

export interface TextStyle {
  readonly color: Color;
  readonly fontFamily: string;
  readonly fontSize: number;
  readonly fontStyle: FontStyle;
  readonly fontWeight: FontWeight | number;
  readonly letterSpacing: number;
  readonly ligatures: boolean;
  readonly subscript: boolean;
  readonly superscript: boolean;
}

export const DEFAULT_TEXT_STYLE: TextStyle = {
  color: DEFAULT_COLOR,
  fontFamily: "sans-serif",
  fontSize: 100,
  fontStyle: DEFAULT_FONT_STYLE,
  fontWeight: DEFAULT_FONT_WEIGHT,
  letterSpacing: 1,
  ligatures: false,
  subscript: false,
  superscript: false,
};
