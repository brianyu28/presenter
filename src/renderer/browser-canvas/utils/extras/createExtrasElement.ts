import { Size } from "../../../../types/Size";

/**
 * Extra elements are treated as foreignObjects in an SVG container element.
 * This function creates the extras container SVG element to host the slide extras.
 */
export function createExtrasElement(size: Size): SVGSVGElement {
  const extrasElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  extrasElement.setAttribute("viewBox", `0 0 ${size.width} ${size.height}`);
  extrasElement.style.backgroundColor = "transparent";
  extrasElement.style.position = "absolute";
  extrasElement.style.width = "100%";

  return extrasElement;
}
