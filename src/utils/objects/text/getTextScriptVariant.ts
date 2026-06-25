import { TextStyle } from "../../../types/TextStyle";

const SCRIPT_FONT_SIZE_SCALE = 0.7;
const SCRIPT_BASELINE_SHIFT_SCALE = 0.3;

export interface TextScriptVariant {
  readonly baselineShift: number;
  readonly fontSize: number;
  readonly isSubscript: boolean;
  readonly isSuperscript: boolean;
}

export function getTextScriptVariant(textStyle: TextStyle): TextScriptVariant {
  const isSuperscript = textStyle.superscript;
  const isSubscript = textStyle.subscript && !isSuperscript;

  if (!isSuperscript && !isSubscript) {
    return {
      baselineShift: 0,
      fontSize: textStyle.fontSize,
      isSubscript: false,
      isSuperscript: false,
    };
  }

  return {
    baselineShift: textStyle.fontSize * SCRIPT_BASELINE_SHIFT_SCALE * (isSuperscript ? -1 : 1),
    fontSize: textStyle.fontSize * SCRIPT_FONT_SIZE_SCALE,
    isSubscript,
    isSuperscript,
  };
}
