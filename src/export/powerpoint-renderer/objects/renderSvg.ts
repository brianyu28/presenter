import { SVG } from "../../../objects/SVG";
import { Position } from "../../../types/Position";
import { Size } from "../../../types/Size";
import { PowerPointObjectRenderer } from "../types/PowerPointObjectRenderer";
import { getTransformedBoundingBox } from "../utils/getTransformedBoundingBox";
import { getInchesFromPixels } from "../utils/getUnitsFromPixels";

export const renderSvg: PowerPointObjectRenderer<SVG> = ({
  slide,
  object: svg,
  opacity,
  pixelsPerInch,
  transform,
}) => {
  const targetOpacity = svg.opacity * opacity;
  if (targetOpacity === 0 || !svg.svg) {
    return;
  }

  const { origin, size } = getTransformedBoundingBox(
    Position({ x: svg.x, y: svg.y }),
    svg.anchor,
    Size({ width: svg.width, height: svg.height }),
    transform,
  );

  const sanitized = svg.svg.replace(/<\?xml[^?]*\?>\s*/g, "");
  const base64 = Buffer.from(sanitized).toString("base64");

  slide.addImage({
    data: `data:image/svg+xml;base64,${base64}`,
    x: getInchesFromPixels(origin.x, pixelsPerInch),
    y: getInchesFromPixels(origin.y, pixelsPerInch),
    w: getInchesFromPixels(size.width, pixelsPerInch),
    h: getInchesFromPixels(size.height, pixelsPerInch),
    transparency: (1 - targetOpacity) * 100,
  });
};
