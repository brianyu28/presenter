import { Arrow } from "../../../objects/Arrow";
import { Position } from "../../../types/Position";

interface Return {
  readonly arrowPoints: Position[];
  readonly arrowheadPoints: Position[];
  readonly doubledArrowheadPoints: Position[];
}

export function getArrowPoints(arrow: Arrow): Return {
  const { drawn, startX, startY, endX, endY, arrowheadSize, isArrowheadFilled, isDrawnFromCenter } =
    arrow;
  const start = { x: startX, y: startY };
  const end = { x: endX, y: endY };

  const angle = Math.atan2(end.y - start.y, end.x - start.x);
  const midpoint = { x: start.x + (end.x - start.x) / 2, y: start.y + (end.y - start.y) / 2 };

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy);

  const drawnLength = length * drawn;
  const unitX = Math.cos(angle);
  const unitY = Math.sin(angle);

  const drawnStart = isDrawnFromCenter
    ? { x: midpoint.x - (unitX * drawnLength) / 2, y: midpoint.y - (unitY * drawnLength) / 2 }
    : start;
  const drawnEnd = isDrawnFromCenter
    ? { x: midpoint.x + (unitX * drawnLength) / 2, y: midpoint.y + (unitY * drawnLength) / 2 }
    : { x: start.x + unitX * drawnLength, y: start.y + unitY * drawnLength };

  const arrowAngle = isArrowheadFilled ? Math.PI / 6 : Math.PI / 4.5;
  const adjustedArrowheadSize = drawnLength < arrowheadSize * 2 ? drawnLength / 2 : arrowheadSize;

  const arrowheadBase1 = {
    x: drawnEnd.x - adjustedArrowheadSize * Math.cos(angle - arrowAngle),
    y: drawnEnd.y - adjustedArrowheadSize * Math.sin(angle - arrowAngle),
  };

  const arrowheadBase2 = {
    x: drawnEnd.x - adjustedArrowheadSize * Math.cos(angle + arrowAngle),
    y: drawnEnd.y - adjustedArrowheadSize * Math.sin(angle + arrowAngle),
  };

  const doubledArrowheadBase1 = {
    x: drawnStart.x + adjustedArrowheadSize * Math.cos(angle - arrowAngle),
    y: drawnStart.y + adjustedArrowheadSize * Math.sin(angle - arrowAngle),
  };

  const doubledArrowheadBase2 = {
    x: drawnStart.x + adjustedArrowheadSize * Math.cos(angle + arrowAngle),
    y: drawnStart.y + adjustedArrowheadSize * Math.sin(angle + arrowAngle),
  };

  return {
    arrowPoints: [drawnStart, drawnEnd],
    arrowheadPoints: [arrowheadBase1, drawnEnd, arrowheadBase2],
    doubledArrowheadPoints: [doubledArrowheadBase1, drawnStart, doubledArrowheadBase2],
  };
}
