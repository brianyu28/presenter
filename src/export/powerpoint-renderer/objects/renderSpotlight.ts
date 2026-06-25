import { Spotlight } from "../../../objects/Spotlight";
import { Anchor } from "../../../types/Anchor";
import { Position } from "../../../types/Position";
import { Size } from "../../../types/Size";
import { getAlphaForColor } from "../../../utils/color/getAlphaForColor";
import { getSpotlightCutout } from "../../../utils/objects/spotlight/getSpotlightCutout";
import { PowerPointObjectRenderer } from "../types/PowerPointObjectRenderer";
import { getTransformedBoundingBox } from "../utils/getTransformedBoundingBox";
import { getInchesFromPixels } from "../utils/getUnitsFromPixels";

function getCutoutPath(spotlight: Spotlight, transformScale: number): string {
  const { origin, size, cornerRadius } = getSpotlightCutout(spotlight);
  const { x, y } = origin;
  const { width, height } = size;
  const radius = Math.max(0, Math.min(cornerRadius * transformScale, Math.min(width, height) / 2));

  if (radius === 0) {
    return `M ${x} ${y} V ${y + height} H ${x + width} V ${y} H ${x} Z`;
  }

  return [
    `M ${x + radius} ${y}`,
    `Q ${x} ${y} ${x} ${y + radius}`,
    `V ${y + height - radius}`,
    `Q ${x} ${y + height} ${x + radius} ${y + height}`,
    `H ${x + width - radius}`,
    `Q ${x + width} ${y + height} ${x + width} ${y + height - radius}`,
    `V ${y + radius}`,
    `Q ${x + width} ${y} ${x + width - radius} ${y}`,
    `H ${x + radius}`,
    "Z",
  ].join(" ");
}

export const renderSpotlight: PowerPointObjectRenderer<Spotlight> = ({
  object: spotlight,
  opacity,
  pixelsPerInch,
  slide,
  slideSize,
  transform,
}) => {
  const targetOpacity = spotlight.opacity * opacity;
  if (targetOpacity === 0 || spotlight.color.alpha === 0) {
    return;
  }

  const transformedCutout = getTransformedBoundingBox(
    Position({ x: spotlight.x, y: spotlight.y }),
    spotlight.anchor,
    Size({ width: spotlight.width, height: spotlight.height }),
    transform,
  );
  const { red, green, blue } = spotlight.color;
  const fillOpacity = getAlphaForColor(spotlight.color, targetOpacity);
  const cutoutPath = getCutoutPath(
    {
      ...spotlight,
      anchor: Anchor.TOP_LEFT,
      x: transformedCutout.origin.x,
      y: transformedCutout.origin.y,
      width: transformedCutout.size.width,
      height: transformedCutout.size.height,
    },
    transform.scale,
  );
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${slideSize.width}" height="${slideSize.height}" viewBox="0 0 ${slideSize.width} ${slideSize.height}">`,
    `<path fill="rgb(${red}, ${green}, ${blue})" fill-opacity="${fillOpacity}" fill-rule="evenodd" d="M 0 0 H ${slideSize.width} V ${slideSize.height} H 0 Z ${cutoutPath}"/>`,
    "</svg>",
  ].join("");
  const base64 = Buffer.from(svg).toString("base64");

  slide.addImage({
    data: `data:image/svg+xml;base64,${base64}`,
    x: 0,
    y: 0,
    w: getInchesFromPixels(slideSize.width, pixelsPerInch),
    h: getInchesFromPixels(slideSize.height, pixelsPerInch),
  });
};
