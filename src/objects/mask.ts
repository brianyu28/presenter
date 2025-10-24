import { Anchor, DEFAULT_ANCHOR } from "../types/Anchor";
import { ObjectType } from "../types/ObjectType";
import { SlideObject } from "../types/SlideObject";

export interface Mask extends SlideObject {
  readonly objectType: typeof ObjectType.MASK;
  readonly anchor: Anchor;
  readonly height: number;
  readonly objects: SlideObject[];

  /** A debugging flag that allows previewing the mask shape. */
  readonly preview: boolean;

  readonly width: number;
  readonly x: number;
  readonly y: number;
}

export function Mask(
  objects: SlideObject[],
  props: Partial<Omit<Mask, "objects">> | null = null,
): Mask {
  return SlideObject({
    objectType: ObjectType.MASK,
    anchor: DEFAULT_ANCHOR,
    height: 100,
    objects,
    preview: false,
    width: 100,
    x: 0,
    y: 0,
    ...props,
  });
}
