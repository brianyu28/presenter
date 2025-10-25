import { Color, DEFAULT_COLOR } from "../types/Color";
import { ObjectType } from "../types/ObjectType";
import { Position } from "../types/Position";
import { SlideObject } from "../types/SlideObject";

export interface Polygon extends SlideObject {
  readonly objectType: typeof ObjectType.POLYGON;
  readonly borderColor: Color;
  readonly borderWidth: number;
  readonly drawn: number;
  readonly points: readonly Position[];
  readonly fill: Color;
}

export function Polygon(props: Partial<Polygon> | null = null): Polygon {
  return SlideObject({
    objectType: ObjectType.POLYGON,
    borderColor: DEFAULT_COLOR,
    borderWidth: 0,
    drawn: 1,
    points: [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
    ],
    fill: DEFAULT_COLOR,
    ...props,
  });
}
