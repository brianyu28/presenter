import { TextStyle } from "../../../../types/TextStyle";
import { getRgbStringForColor } from "../../../../utils/color/getRgbStringForColor";
import { getTextScriptVariant } from "../../../../utils/objects/text/getTextScriptVariant";
import { CanvasContextType, UnifiedCanvasContext } from "../../types/UnifiedCanvasContext";

export function setContextWithTextStyle(
  ctx: UnifiedCanvasContext,
  textStyle: TextStyle,
  opacity: number = 1,
) {
  const scriptVariant = getTextScriptVariant(textStyle);

  ctx.context.fillStyle = getRgbStringForColor(textStyle.color, opacity);
  ctx.context.font = `${textStyle.fontStyle} ${textStyle.fontWeight} ${scriptVariant.fontSize}px ${textStyle.fontFamily}`;

  if (ctx.type === CanvasContextType.Browser) {
    ctx.context.textRendering = textStyle.ligatures ? "optimizeLegibility" : "optimizeSpeed";
  } else {
    ctx.context.fontVariant = textStyle.ligatures ? "common-ligatures" : "no-common-ligatures";
  }
}
