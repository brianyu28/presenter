import { Color, DEFAULT_COLOR } from "../types/Color";
import { ObjectType } from "../types/ObjectType";
import { SlideObject } from "../types/SlideObject";

export interface Line extends SlideObject {
  readonly objectType: typeof ObjectType.LINE;
  readonly color: Color;
  readonly drawn: number;
  readonly endX: number;
  readonly endY: number;
  readonly growFromCenter: boolean;
  readonly startX: number;
  readonly startY: number;
  readonly width: number;
}

export function Line(props: Partial<Line> | null = null): Line {
  return SlideObject({
    objectType: ObjectType.LINE,
    color: DEFAULT_COLOR,
    drawn: 1,
    endX: 100,
    endY: 100,
    growFromCenter: false,
    startX: 0,
    startY: 0,
    width: 10,
    ...props,
  });
}
