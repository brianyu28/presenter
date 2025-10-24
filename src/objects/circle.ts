import { Anchor, DEFAULT_ANCHOR } from "../types/Anchor";
import { Color, DEFAULT_COLOR } from "../types/Color";
import { ObjectType } from "../types/ObjectType";
import { SlideObject } from "../types/SlideObject";

const DEFAULT_CIRCLE_RADIUS = 50;

export interface Circle extends SlideObject {
  readonly objectType: typeof ObjectType.CIRCLE;
  readonly anchor: Anchor;
  readonly borderColor: Color;
  readonly borderWidth: number;
  readonly drawn: number;
  readonly fill: Color;
  readonly radius: number;
  readonly x: number;
  readonly y: number;
}

export function Circle(props: Partial<Circle> | null = null): Circle {
  return SlideObject({
    objectType: ObjectType.CIRCLE,
    anchor: DEFAULT_ANCHOR,
    borderColor: DEFAULT_COLOR,
    borderWidth: 0,
    drawn: 1,
    fill: DEFAULT_COLOR,
    radius: DEFAULT_CIRCLE_RADIUS,
    x: 0,
    y: 0,
    ...props,
  });
}
