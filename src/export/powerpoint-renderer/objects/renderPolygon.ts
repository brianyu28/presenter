import { Polygon } from "../../../objects/Polygon";
import {
  CanvasContextType,
  UnifiedCanvasContext,
} from "../../../renderer/browser-canvas/types/UnifiedCanvasContext";
import { drawStroke } from "../../../renderer/browser-canvas/utils/drawStroke";
import { fillPath } from "../../../renderer/browser-canvas/utils/fillPath";
import { getPolygonPath } from "../../../utils/objects/polygon/getPolygonPath";
import { createCanvasElement } from "../../utils/createCanvasElement";
import { createPath2D } from "../../utils/createPath2D";
import { PowerPointObjectRenderer } from "../types/PowerPointObjectRenderer";
import { getInchesFromPixels } from "../utils/getUnitsFromPixels";

export const renderPolygon: PowerPointObjectRenderer<Polygon> = ({
  slide,
  object: polygon,
  opacity,
  pixelsPerInch,
  transform,
}) => {
  const targetOpacity = polygon.opacity * opacity;
  if (
    targetOpacity === 0 ||
    (polygon.drawn === 0 && polygon.fill.alpha === 0) ||
    polygon.points.length === 0
  ) {
    return;
  }

  const polygonWidth = Math.max(...polygon.points.map((p) => p.x));
  const polygonHeight = Math.max(...polygon.points.map((p) => p.y));

  const canvas = createCanvasElement({ width: polygonWidth, height: polygonHeight });
  const context = canvas.getContext("2d");
  const ctx: UnifiedCanvasContext = {
    type: CanvasContextType.Node,
    context,
  };

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

  const dataUrl = canvas.toDataURL("png");

  slide.addImage({
    data: dataUrl,
    x: getInchesFromPixels(transform.translateX, pixelsPerInch),
    y: getInchesFromPixels(transform.translateY, pixelsPerInch),
    w: getInchesFromPixels(polygonWidth * transform.scale, pixelsPerInch),
    h: getInchesFromPixels(polygonHeight * transform.scale, pixelsPerInch),
    transparency: 100 * (1 - targetOpacity),
  });
};
