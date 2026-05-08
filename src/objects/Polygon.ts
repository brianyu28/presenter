import { Color, DEFAULT_COLOR } from "../types/Color";
import { ObjectType } from "../types/ObjectType";
import { Position } from "../types/Position";
import { SlideObject } from "../types/SlideObject";

export interface Polygon extends SlideObject {
  readonly objectType: typeof ObjectType.POLYGON;
  readonly strokeColor: Color;
  readonly strokeWidth: number;
  readonly drawn: number;
  readonly points: readonly Position[];
  readonly fillColor: Color;
}

export function Polygon(props: Partial<Polygon> | null = null): Polygon {
  return SlideObject({
    objectType: ObjectType.POLYGON,
    strokeColor: DEFAULT_COLOR,
    strokeWidth: 0,
    drawn: 1,
    points: [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
    ],
    fillColor: DEFAULT_COLOR,
    ...props,
  });
}
