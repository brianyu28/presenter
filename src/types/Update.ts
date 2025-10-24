import { AnimationType } from "./AnimationType";
import { BaseUnitSlideAnimation } from "./BaseUnitSlideAnimation";
import { SlideObject } from "./SlideObject";

export interface Update<T extends SlideObject> extends BaseUnitSlideAnimation {
  readonly type: typeof AnimationType.UPDATE;
  readonly object: T;
  readonly props: Partial<Omit<T, "objectType">>;
}

export function Update<T extends SlideObject>(
  object: T,
  props: Partial<Omit<T, "objectType">>,
): Update<T> {
  return {
    type: AnimationType.UPDATE,
    isKey: false,
    object,
    props,
    shortcut: null,
  };
}
