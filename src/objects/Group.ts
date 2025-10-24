import { Anchor, DEFAULT_ANCHOR } from "../types/Anchor";
import { ObjectType } from "../types/ObjectType";
import { SlideObject } from "../types/SlideObject";

export interface Group extends SlideObject {
  readonly objectType: typeof ObjectType.GROUP;
  readonly anchor: Anchor;
  readonly height: number;
  readonly objects: SlideObject[];
  readonly rotateOriginX: number;
  readonly rotateOriginY: number;
  readonly rotation: number;
  readonly scale: number;
  readonly width: number;
  readonly x: number;
  readonly y: number;
}

export function Group(
  objects: SlideObject[],
  props: Partial<Omit<Group, "objects">> | null = null,
): Group {
  return SlideObject({
    objectType: ObjectType.GROUP,
    anchor: DEFAULT_ANCHOR,
    height: 0,
    objects,
    rotateOriginX: 0,
    rotateOriginY: 0,
    rotation: 0,
    scale: 1,
    width: 0,
    x: 0,
    y: 0,
    ...props,
  });
}
