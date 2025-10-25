import { Polygon } from "../../../objects/Polygon";
import { PathWithLength } from "../../../types/PathWithLength";

export function getPolygonPath(polygon: Polygon): PathWithLength {
  const path = new Path2D();
  const points = polygon.points;

  const firstPoint = points[0];
  if (firstPoint === undefined) {
    return { path, length: 0 };
  }

  path.moveTo(firstPoint.x, firstPoint.y);

  let length = 0;
  let previousPoint = firstPoint;
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    if (point === undefined) {
      continue;
    }
    path.lineTo(point.x, point.y);
    const segmentLength = Math.hypot(point.x - previousPoint.x, point.y - previousPoint.y);
    length += segmentLength;
    previousPoint = point;
  }

  path.closePath();
  const closingSegmentLength = Math.hypot(
    firstPoint.x - previousPoint.x,
    firstPoint.y - previousPoint.y,
  );
  length += closingSegmentLength;

  return { path, length };
}
