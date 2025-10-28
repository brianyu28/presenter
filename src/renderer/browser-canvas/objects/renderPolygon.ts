import { Polygon } from "../../../objects/Polygon";
import { getPolygonPath } from "../../../utils/objects/polygon/getPolygonPath";
import { BrowserCanvasObjectRenderer } from "../types/BrowserCanvasObjectRenderer";
import { drawStroke } from "../utils/drawStroke";
import { fillPath } from "../utils/fillPath";

export const renderPolygon: BrowserCanvasObjectRenderer<Polygon> = ({
  ctx,
  object: polygon,
  opacity,
  createPath2D,
}) => {
  const targetOpacity = polygon.opacity * opacity;
  if (targetOpacity === 0 || (polygon.drawn === 0 && polygon.fill.alpha === 0)) {
    return;
  }

  const { path, length } = getPolygonPath(polygon, createPath2D);

  fillPath({
    ctx,
    path,
    color: polygon.fill,
    opacity: targetOpacity,
  });

  drawStroke({
    color: polygon.borderColor,
    ctx,
    drawn: polygon.drawn,
    path,
    pathLength: length,
    opacity: targetOpacity,
    width: polygon.borderWidth,
  });
};
