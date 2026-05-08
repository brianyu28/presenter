import { Anchor, DEFAULT_ANCHOR } from "../types/Anchor";
import { Color, DEFAULT_COLOR } from "../types/Color";
import { ObjectType } from "../types/ObjectType";
import { SlideObject } from "../types/SlideObject";

export interface Rectangle extends SlideObject {
  readonly objectType: typeof ObjectType.RECTANGLE;
  readonly anchor: Anchor;
  readonly strokeColor: Color;
  readonly strokeWidth: number;
  readonly drawn: number;
  readonly fillColor: Color;
  readonly height: number;
  readonly cornerRadius: number;
  readonly width: number;
  readonly x: number;
  readonly y: number;
}

export function Rectangle(props: Partial<Rectangle> | null = null): Rectangle {
  return SlideObject({
    objectType: ObjectType.RECTANGLE,
    anchor: DEFAULT_ANCHOR,
    strokeColor: DEFAULT_COLOR,
    strokeWidth: 0,
    drawn: 1,
    fillColor: DEFAULT_COLOR,
    height: 100,
    cornerRadius: 0,
    width: 100,
    x: 0,
    y: 0,
    ...props,
  });
}
