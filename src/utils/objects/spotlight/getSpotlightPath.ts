import { Spotlight } from "../../../objects/Spotlight";
import { UnifiedPath2D } from "../../../renderer/browser-canvas/types/UnifiedPath2D";
import { Position } from "../../../types/Position";
import { Size } from "../../../types/Size";
import { getSpotlightCutout } from "./getSpotlightCutout";

interface SpotlightPathBounds {
  readonly origin: Position;
  readonly size: Size;
}

export function getSpotlightPath(
  spotlight: Spotlight,
  slideSize: Size,
  createPath: () => UnifiedPath2D,
  bounds: SpotlightPathBounds = {
    origin: Position({ x: 0, y: 0 }),
    size: slideSize,
  },
): UnifiedPath2D {
  const path = createPath();
  const { origin, size, cornerRadius } = getSpotlightCutout(spotlight);
  const { origin: boundsOrigin, size: boundsSize } = bounds;

  path.path.moveTo(boundsOrigin.x, boundsOrigin.y);
  path.path.lineTo(boundsOrigin.x + boundsSize.width, boundsOrigin.y);
  path.path.lineTo(boundsOrigin.x + boundsSize.width, boundsOrigin.y + boundsSize.height);
  path.path.lineTo(boundsOrigin.x, boundsOrigin.y + boundsSize.height);
  path.path.lineTo(boundsOrigin.x, boundsOrigin.y);

  // Draw the cutout in the opposite direction so the non-zero fill rule leaves it transparent.
  if (cornerRadius === 0) {
    path.path.moveTo(origin.x, origin.y);
    path.path.lineTo(origin.x, origin.y + size.height);
    path.path.lineTo(origin.x + size.width, origin.y + size.height);
    path.path.lineTo(origin.x + size.width, origin.y);
    path.path.lineTo(origin.x, origin.y);
    return path;
  }

  path.path.moveTo(origin.x + cornerRadius, origin.y);
  path.path.arcTo(origin.x, origin.y, origin.x, origin.y + cornerRadius, cornerRadius);
  path.path.lineTo(origin.x, origin.y + size.height - cornerRadius);
  path.path.arcTo(
    origin.x,
    origin.y + size.height,
    origin.x + cornerRadius,
    origin.y + size.height,
    cornerRadius,
  );
  path.path.lineTo(origin.x + size.width - cornerRadius, origin.y + size.height);
  path.path.arcTo(
    origin.x + size.width,
    origin.y + size.height,
    origin.x + size.width,
    origin.y + size.height - cornerRadius,
    cornerRadius,
  );
  path.path.lineTo(origin.x + size.width, origin.y + cornerRadius);
  path.path.arcTo(
    origin.x + size.width,
    origin.y,
    origin.x + size.width - cornerRadius,
    origin.y,
    cornerRadius,
  );
  path.path.lineTo(origin.x + cornerRadius, origin.y);

  return path;
}
