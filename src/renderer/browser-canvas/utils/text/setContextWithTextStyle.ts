import { TextStyle } from "../../../../types/TextStyle";
import { getRgbStringForColor } from "../../../../utils/color/getRgbStringForColor";
import { CanvasContextType, UnifiedCanvasContext } from "../../types/UnifiedCanvasContext";

export function setContextWithTextStyle(
  ctx: UnifiedCanvasContext,
  textStyle: TextStyle,
  opacity: number = 1,
) {
  ctx.context.fillStyle = getRgbStringForColor(textStyle.color, opacity);
  ctx.context.font = `${textStyle.fontStyle} ${textStyle.fontWeight} ${textStyle.fontSize}px ${textStyle.fontFamily}`;

  if (ctx.type === CanvasContextType.Browser) {
    ctx.context.textRendering = textStyle.ligatures ? "optimizeLegibility" : "optimizeSpeed";
  } else {
    ctx.context.fontVariant = textStyle.ligatures ? "common-ligatures" : "no-common-ligatures";
  }
}
