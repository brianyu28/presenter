import { Anchor, DEFAULT_ANCHOR } from "../types/Anchor";
import { Color, DEFAULT_COLOR } from "../types/Color";
import { SlideWebExtra } from "../types/SlideWebExtra";
import { getHexStringForColor } from "../utils/color/getHexStringForColor";

export interface IFrame {
  readonly url: string;
  readonly backgroundColor: Color;
  readonly strokeColor: Color;
  readonly strokeWidth: number;
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
    strokeColor = DEFAULT_COLOR,
    strokeWidth = 0,
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
    strokeWidth > 0 ? `${strokeWidth}px solid ${getHexStringForColor(strokeColor)}` : "none";
  iframe.style.pointerEvents = pointerEvents;

  const scaledSize = (100 / scale).toFixed(3) + "%";
  iframe.style.height =
    strokeWidth === 0 ? scaledSize : `calc(${scaledSize} - ${strokeWidth * 2}px)`;
  iframe.style.width =
    strokeWidth === 0 ? scaledSize : `calc(${scaledSize} - ${strokeWidth * 2}px)`;
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
