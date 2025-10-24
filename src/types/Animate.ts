import { AnimationType } from "./AnimationType";
import { BaseUnitSlideAnimation } from "./BaseUnitSlideAnimation";
import { DEFAULT_EASING } from "./Easing";
import { EasingFunction } from "./EasingFunction";
import { Interpolator } from "./Interpolator";
import { SlideObject } from "./SlideObject";

export interface Animate<T extends SlideObject> extends BaseUnitSlideAnimation {
  readonly type: typeof AnimationType.ANIMATE;
  readonly object: T;
  readonly props: Partial<Omit<T, "objectType">>;
  readonly duration: number;
  readonly easing: EasingFunction;

  /** Whether animation should block future animations from starting. */
  readonly block: boolean;

  /** Custom interpolators to use for performing animation. */
  readonly interpolators: Interpolator<any>[] | null;
}

export type AnimationParams<T extends SlideObject> =
  | number
  | Partial<Omit<Animate<T>, "object" | "props">>;

export function Animate<T extends SlideObject>(
  object: T,
  props: Partial<Omit<T, "objectType">>,
  animationParams: AnimationParams<T> = {},
): Animate<T> {
  return {
    type: AnimationType.ANIMATE,
    object,
    props,
    duration: 1000,
    easing: DEFAULT_EASING,
    block: false,
    interpolators: null,
    isKey: false,
    shortcut: null,
    ...(typeof animationParams === "number" ? { duration: animationParams } : animationParams),
  };
}
