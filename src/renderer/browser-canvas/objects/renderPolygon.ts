import { Polygon } from "../../../objects/Polygon";
import { getPolygonPath } from "../../../utils/objects/polygon/getPolygonPath";
import { BrowserCanvasObjectRenderer } from "../types/BrowserCanvasObjectRenderer";
import { drawStroke } from "../utils/drawStroke";
import { fillPath } from "../utils/fillPath";

export const renderPolygon: BrowserCanvasObjectRenderer<Polygon> = ({
  ctx,
  object: polygon,
  opacity,
}) => {
  const { path, length } = getPolygonPath(polygon);

  fillPath({
    ctx,
    path,
    color: polygon.fill,
    opacity: polygon.opacity * opacity,
  });

  drawStroke({
    color: polygon.borderColor,
    ctx,
    drawn: polygon.drawn,
    path,
    pathLength: length,
    opacity: polygon.opacity * opacity,
    width: polygon.borderWidth,
  });
};
