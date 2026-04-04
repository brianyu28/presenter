import { Anchor, DEFAULT_ANCHOR } from "../types/Anchor";
import { ObjectType } from "../types/ObjectType";
import { SlideObject } from "../types/SlideObject";

export interface SVG extends SlideObject {
  readonly objectType: typeof ObjectType.SVG;
  readonly anchor: Anchor;
  readonly height: number;
  readonly svg: string;
  readonly width: number;
  readonly x: number;
  readonly y: number;
}

export function SVG(props: Partial<SVG> | null = null): SVG {
  return SlideObject({
    objectType: ObjectType.SVG,
    anchor: DEFAULT_ANCHOR,
    height: 100,
    svg: "",
    width: 100,
    x: 0,
    y: 0,
    ...props,
  });
}
