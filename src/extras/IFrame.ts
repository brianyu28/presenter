import { Anchor, DEFAULT_ANCHOR } from "../types/Anchor";
import { Color, DEFAULT_COLOR } from "../types/Color";
import { SlideWebExtra } from "../types/SlideWebExtra";
import { getHexStringForColor } from "../utils/color/getHexStringForColor";

export interface IFrame {
  readonly url: string;
  readonly backgroundColor: Color;
  readonly borderColor: Color;
  readonly borderWidth: number;
  readonly pointerEvents: string;
  readonly scale: number;

  readonly anchor: Anchor;
  readonly height: number;
  readonly width: number;
  readonly x: number;
  readonly y: number;
}

export function IFrame(props: Partial<IFrame> | null = null): SlideWebExtra {
  const {
    url = "https://wikipedia.org/",
    backgroundColor = Color.TRANSPARENT,
    borderColor = DEFAULT_COLOR,
    borderWidth = 0,
    pointerEvents = "auto",
    scale = 1,
    anchor = DEFAULT_ANCHOR,
    height = 1000,
    width = 1000,
    x = 0,
    y = 0,
  } = props || {};

  const iframe = document.createElement("iframe");
  iframe.src = url;
  iframe.style.backgroundColor = getHexStringForColor(backgroundColor);
  iframe.style.border =
    borderWidth > 0 ? `${borderWidth}px solid ${getHexStringForColor(borderColor)}` : "none";
  iframe.style.pointerEvents = pointerEvents;

  const scaledSize = (100 / scale).toFixed(3) + "%";
  iframe.style.height =
    borderWidth === 0 ? scaledSize : `calc(${scaledSize} - ${borderWidth * 2}px)`;
  iframe.style.width =
    borderWidth === 0 ? scaledSize : `calc(${scaledSize} - ${borderWidth * 2}px)`;
  iframe.style.transform = `scale(${scale})`;
  iframe.style.transformOrigin = "top left";

  return SlideWebExtra({
    content: iframe,
    anchor,
    height,
    width,
    x,
    y,
  });
}
