import { Arrow } from "../../../objects/Arrow";
import { getArrowPoints } from "../../../utils/objects/arrow/getArrowPoints";
import { BrowserCanvasObjectRenderer } from "../types/BrowserCanvasObjectRenderer";
import { drawStroke } from "../utils/drawStroke";
import { fillPath } from "../utils/fillPath";
import { getPathFromPositions } from "../utils/getPathFromPoints";

export const renderArrow: BrowserCanvasObjectRenderer<Arrow> = ({
  ctx,
  object: arrow,
  opacity,
  createPath2D,
}) => {
  if (arrow.drawn === 0) {
    return;
  }

  const { arrowPoints, arrowheadPoints, doubledArrowheadPoints } = getArrowPoints(arrow);

  const { path: arrowPath } = getPathFromPositions(arrowPoints, createPath2D);
  const { path: arrowheadPath } = getPathFromPositions(arrowheadPoints, createPath2D);

  // Draw main arrow line
  drawStroke({
    color: arrow.color,
    ctx,
    path: arrowPath,
    opacity: arrow.opacity * opacity,
    width: arrow.width,
  });

  // Draw arrowhead
  if (arrow.isArrowheadFilled) {
    arrowheadPath.path.closePath();
    fillPath({
      ctx,
      path: arrowheadPath,
      color: arrow.color,
      opacity: arrow.opacity * opacity,
    });
  }
  drawStroke({
    color: arrow.color,
    ctx,
    path: arrowheadPath,
    opacity: arrow.opacity * opacity,
    width: arrow.width,
  });

  if (arrow.isArrowheadDoubled) {
    // Draw doubled arrowhead
    const { path: doubledArrowheadPath } = getPathFromPositions(
      doubledArrowheadPoints,
      createPath2D,
    );
    if (arrow.isArrowheadFilled) {
      doubledArrowheadPath.path.closePath();
      fillPath({
        ctx,
        path: doubledArrowheadPath,
        color: arrow.color,
        opacity: arrow.opacity * opacity,
      });
    }
    drawStroke({
      color: arrow.color,
      ctx,
      path: doubledArrowheadPath,
      opacity: arrow.opacity * opacity,
      width: arrow.width,
    });
  }
};
