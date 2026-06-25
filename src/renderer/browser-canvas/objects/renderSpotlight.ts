import { Spotlight } from "../../../objects/Spotlight";
import { Position } from "../../../types/Position";
import { Size } from "../../../types/Size";
import { getSpotlightPath } from "../../../utils/objects/spotlight/getSpotlightPath";
import { BrowserCanvasObjectRenderer } from "../types/BrowserCanvasObjectRenderer";
import { fillPath } from "../utils/fillPath";

export const renderSpotlight: BrowserCanvasObjectRenderer<Spotlight> = ({
  createPath2D,
  ctx,
  object: spotlight,
  opacity,
  renderScale,
  slideSize,
}) => {
  const targetOpacity = spotlight.opacity * opacity;
  if (targetOpacity === 0 || spotlight.color.alpha === 0) {
    return;
  }

  const overlaySize = Size({
    width: slideSize.width / renderScale,
    height: slideSize.height / renderScale,
  });
  const overlayOrigin = Position({
    x: (slideSize.width - overlaySize.width) / 2,
    y: (slideSize.height - overlaySize.height) / 2,
  });

  // The slide content may be scaled down by BrowserCanvasRenderer; expand the dimmer in
  // slide coordinates so it still covers the whole canvas after that transform is applied.
  const path = getSpotlightPath(spotlight, slideSize, createPath2D, {
    origin: overlayOrigin,
    size: overlaySize,
  });
  fillPath({ ctx, path, color: spotlight.color, opacity: targetOpacity });
};
