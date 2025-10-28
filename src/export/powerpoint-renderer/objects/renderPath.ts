import { Path } from "../../../objects/Path";
import {
  CanvasContextType,
  UnifiedCanvasContext,
} from "../../../renderer/browser-canvas/types/UnifiedCanvasContext";
import { drawStroke } from "../../../renderer/browser-canvas/utils/drawStroke";
import { fillPath } from "../../../renderer/browser-canvas/utils/fillPath";
import { createCanvasElement } from "../../utils/createCanvasElement";
import { createPath2D } from "../../utils/createPath2D";
import { PowerPointObjectRenderer } from "../types/PowerPointObjectRenderer";
import { getInchesFromPixels } from "../utils/getUnitsFromPixels";

export const renderPath: PowerPointObjectRenderer<Path> = ({
  slide,
  object: path,
  opacity,
  pixelsPerInch,
  transform,
}) => {
  const targetOpacity = path.opacity * opacity;
  if (targetOpacity === 0 || (path.drawn === 0 && path.fill.alpha === 0)) {
    return;
  }

  const canvas = createCanvasElement({ width: path.width, height: path.height });
  const context = canvas.getContext("2d");
  const ctx: UnifiedCanvasContext = {
    type: CanvasContextType.Node,
    context,
  };
  const path2D = createPath2D(path.path);

  fillPath({
    ctx,
    path: path2D,
    color: path.fill,
    opacity: targetOpacity,
  });

  drawStroke({
    color: path.color,
    ctx,
    drawn: path.drawn,
    path: path2D,
    pathLength: path.pathLength,
    opacity: targetOpacity,
    width: path.strokeWidth,
  });

  const dataUrl = canvas.toDataURL("png");

  slide.addImage({
    data: dataUrl,
    x: getInchesFromPixels(transform.translateX, pixelsPerInch),
    y: getInchesFromPixels(transform.translateY, pixelsPerInch),
    w: getInchesFromPixels(path.width * transform.scale, pixelsPerInch),
    h: getInchesFromPixels(path.height * transform.scale, pixelsPerInch),
    transparency: 100 * (1 - targetOpacity),
  });
};
