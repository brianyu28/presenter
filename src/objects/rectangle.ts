import { Anchor, DEFAULT_ANCHOR } from "../types/Anchor";
import { Color, DEFAULT_COLOR } from "../types/Color";
import { ObjectType } from "../types/ObjectType";
import { SlideObject } from "../types/SlideObject";

export interface Rectangle extends SlideObject {
  readonly objectType: typeof ObjectType.RECTANGLE;
  readonly anchor: Anchor;
  readonly borderColor: Color;
  readonly borderWidth: number;
  readonly drawn: number;
  readonly fill: Color;
  readonly height: number;
  readonly rounding: number;
  readonly width: number;
  readonly x: number;
  readonly y: number;
}

export function Rectangle(props: Partial<Rectangle> | null = null): Rectangle {
  return SlideObject({
    objectType: ObjectType.RECTANGLE,
    anchor: DEFAULT_ANCHOR,
    borderColor: DEFAULT_COLOR,
    borderWidth: 0,
    drawn: 1,
    fill: DEFAULT_COLOR,
    height: 100,
    rounding: 0,
    width: 100,
    x: 0,
    y: 0,
    ...props,
  });
}
