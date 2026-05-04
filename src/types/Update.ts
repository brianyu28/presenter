import { AnimationType } from "./AnimationType";
import { BaseUnitSlideAnimation } from "./BaseUnitSlideAnimation";
import { SlideObject } from "./SlideObject";

export interface Update<T extends SlideObject> extends BaseUnitSlideAnimation {
  readonly type: typeof AnimationType.UPDATE;
  readonly object: T;
  readonly props: Partial<Omit<T, "objectType">>;
}

export type UpdateParams<T extends SlideObject> = Partial<Omit<Update<T>, "object" | "props">>;

export function Update<T extends SlideObject>(
  object: T,
  props: Partial<Omit<T, "objectType">>,
  updateParams: UpdateParams<T> = {},
): Update<T> {
  return {
    type: AnimationType.UPDATE,
    isKey: false,
    object,
    props,
    shortcut: null,
    ...updateParams,
  };
}
