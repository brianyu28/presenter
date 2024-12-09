import { ObjectProps, SlideObject } from "../presentation/object";
import { Position } from "../util/position";

export interface PolygonProps extends ObjectProps {
  points: Position[];
  fill: string;
  borderWidth: number;
  borderColor: string;
}

export class Polygon extends SlideObject<PolygonProps> {
  constructor(points: Position[], props: Partial<PolygonProps> = {}) {
    super({
      points: points,
      fill: "#000000",
      borderWidth: 0,
      borderColor: "#000000",
      ...props,
    });
  }

  tagName(): string {
    return "polygon";
  }

  attributes(): Partial<Record<string, string>> {
    const { points, fill, borderWidth, borderColor } = this.props;
    const pointsString = points
      .map((point) => `${point.x},${point.y}`)
      .join(" ");

    return {
      ...super.attributes(),
      points: pointsString,
      fill,
      ...(borderWidth > 0
        ? {
            "stroke-width": borderWidth.toString(),
            stroke: borderColor,
          }
        : {}),
    };
  }
}
