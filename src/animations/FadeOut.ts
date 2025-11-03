import { Animate, AnimationParams } from "../types/Animate";
import { Easing } from "../types/Easing";
import { SlideObject } from "../types/SlideObject";

export function FadeOut<T extends SlideObject>(
  object: T,
  animationParams: AnimationParams<T> | number = {},
): Animate<T> {
  return Animate(object, { opacity: 0 } as Partial<T>, {
    duration: 500,
    easing: Easing.CUBIC,
    ...(typeof animationParams === "number" ? { duration: animationParams } : animationParams),
  });
}
