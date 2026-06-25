import { Spotlight } from "../../../objects/Spotlight";
import { Position } from "../../../types/Position";
import { Size } from "../../../types/Size";
import { getBoundingBox } from "../../layout/getBoundingBox";

export function getSpotlightCutout(spotlight: Spotlight) {
  const { origin, size } = getBoundingBox(
    Position({ x: spotlight.x, y: spotlight.y }),
    spotlight.anchor,
    Size({ width: spotlight.width, height: spotlight.height }),
  );

  return {
    origin,
    size,
    cornerRadius: Math.max(
      0,
      Math.min(spotlight.cornerRadius, Math.min(size.width, size.height) / 2),
    ),
  };
}
