import { AnimationType } from "../../types/AnimationType";
import { SlideAnimation } from "../../types/SlideAnimation";
import { assertNever } from "../core/assertNever";

export function getSlideAnimationDuration(slideAnimation: SlideAnimation): number {
  const animations = Array.isArray(slideAnimation) ? slideAnimation : [slideAnimation];
  let startTime = 0;
  let duration = 0;

  for (const animation of animations) {
    switch (animation.type) {
      case AnimationType.PAUSE:
        startTime += animation.duration;
        break;
      case AnimationType.ANIMATE:
        duration = Math.max(duration, startTime + animation.delay + animation.duration);
        if (animation.block) {
          startTime += animation.delay + animation.duration;
        }
        break;
      case AnimationType.UPDATE:
        // No-op, instantaneous update.
        break;
      default:
        assertNever(animation);
    }
  }

  return duration;
}
