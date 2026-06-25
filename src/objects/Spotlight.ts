import { Anchor, DEFAULT_ANCHOR } from "../types/Anchor";
import { Color } from "../types/Color";
import { ObjectType } from "../types/ObjectType";
import { SlideObject } from "../types/SlideObject";

export interface Spotlight extends SlideObject {
  readonly objectType: typeof ObjectType.SPOTLIGHT;
  readonly anchor: Anchor;

  /** Overlay color; its alpha controls maximum dimming while opacity controls visibility. */
  readonly color: Color;

  readonly height: number;
  readonly cornerRadius: number;
  readonly width: number;
  readonly x: number;
  readonly y: number;
}

/**
 * Dims the full slide while leaving this rectangle-shaped region clear.
 */
export function Spotlight(props: Partial<Spotlight> | null = null): Spotlight {
  return SlideObject({
    objectType: ObjectType.SPOTLIGHT,
    anchor: DEFAULT_ANCHOR,
    color: Color(0, 0, 0, 0.8),
    height: 200,
    cornerRadius: 50,
    width: 200,
    x: 0,
    y: 0,
    ...props,
  });
}
