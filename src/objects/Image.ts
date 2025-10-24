import { Anchor, DEFAULT_ANCHOR } from "../types/Anchor";
import { ObjectType } from "../types/ObjectType";
import { SlideObject } from "../types/SlideObject";

export interface Image extends SlideObject {
  readonly objectType: typeof ObjectType.IMAGE;
  readonly anchor: Anchor;
  readonly height: number;
  readonly imageId: string;
  readonly rounding: number;
  readonly smooth: boolean;
  readonly width: number;
  readonly x: number;
  readonly y: number;
}

export function Image(props: Partial<Image> | null = null): Image {
  return SlideObject({
    objectType: ObjectType.IMAGE,
    anchor: DEFAULT_ANCHOR,
    height: 100,
    imageId: "",
    rounding: 0,
    smooth: true,
    width: 100,
    x: 0,
    y: 0,
    ...props,
  });
}
