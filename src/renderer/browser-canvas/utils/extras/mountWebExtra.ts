import { Position } from "../../../../types/Position";
import { Size } from "../../../../types/Size";
import { SlideWebExtra } from "../../../../types/SlideWebExtra";
import { getBoundingBox } from "../../../../utils/layout/getBoundingBox";

export function mountWebExtra(
  container: SVGSVGElement | null,
  extra: SlideWebExtra,
): (() => void) | null {
  if (container === null) {
    return null;
  }

  const boundingBox = getBoundingBox(
    Position({ x: extra.x, y: extra.y }),
    extra.anchor,
    Size({ width: extra.width, height: extra.height }),
  );

  const foreignObject = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
  foreignObject.setAttribute("x", boundingBox.origin.x.toString());
  foreignObject.setAttribute("y", boundingBox.origin.y.toString());
  foreignObject.setAttribute("width", extra.width.toString());
  foreignObject.setAttribute("height", extra.height.toString());

  const extraElement = extra.content;
  if (extraElement !== null) {
    foreignObject.appendChild(extraElement);
  }

  container.appendChild(foreignObject);

  let cleanup: (() => void) | null = null;
  if (extra.setup !== null) {
    const cleanupResult = extra.setup(foreignObject);
    if (cleanupResult !== undefined) {
      cleanup = cleanupResult;
    }
  }

  // Return cleanup function
  return () => {
    if (cleanup !== null) {
      cleanup();
    }
    container.removeChild(foreignObject);
  };
}
