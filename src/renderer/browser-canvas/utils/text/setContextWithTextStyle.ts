import { TextStyle } from "../../../../types/TextStyle";
import { getRgbStringForColor } from "../../../../utils/color/getRgbStringForColor";

export function setContextWithTextStyle(
  ctx: CanvasRenderingContext2D,
  textStyle: TextStyle,
  opacity: number = 1,
) {
  ctx.fillStyle = getRgbStringForColor(textStyle.color, opacity);
  ctx.font = `${textStyle.fontStyle} ${textStyle.fontWeight} ${textStyle.fontSize}px ${textStyle.fontFamily}`;
  ctx.textRendering = textStyle.ligatures ? "optimizeLegibility" : "optimizeSpeed";
}
