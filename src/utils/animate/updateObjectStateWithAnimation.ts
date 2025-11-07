import { AnimationType } from "../../types/AnimationType";
import { SlideAnimation } from "../../types/SlideAnimation";
import { SlideObject } from "../../types/SlideObject";
import { assertNever } from "../core/assertNever";
import { interpolate } from "../interpolate/interpolate";

/**
 * Mutably updates the object state to reflect the end state of the animation.
 *
 * If a build time is provided, the object state is updated to the state at that
 * time into the animation.
 *
 * @param objectState Map from original objects to current object state.
 * @param slideAnimation The animation to apply.
 * @param buildTime Optional time (in ms) into the animation to apply.
 */
export function updateObjectStateWithAnimation(
  objectState: Map<SlideObject, SlideObject>,
  slideAnimation: SlideAnimation | null,
  buildTime: number | null = null,
) {
  if (slideAnimation === null) {
    return;
  }

  const animations = Array.isArray(slideAnimation) ? slideAnimation : [slideAnimation];

  let elapsedTime = 0;
  for (const animation of animations) {
    if (buildTime !== null && elapsedTime > buildTime) {
      // We've reached the current build time, so no more state to update.
      break;
    }

    switch (animation.type) {
      case AnimationType.ANIMATE: {
        const currentObject = objectState.get(animation.object);
        if (currentObject === undefined) {
          break;
        }

        const timeIntoAnimation = buildTime !== null ? buildTime - elapsedTime : null;
        const proportion = Math.max(
          Math.min(
            timeIntoAnimation !== null
              ? (timeIntoAnimation - animation.delay) / animation.duration
              : 1,
            1,
          ),
          0,
        );

        objectState.set(animation.object, {
          ...currentObject,
          ...interpolate(
            currentObject,
            animation.props,
            animation.easing(proportion),
            animation.interpolators,
          ),
        });

        if (animation.block) {
          elapsedTime += animation.delay + animation.duration;
        }
        break;
      }
      case AnimationType.UPDATE: {
        const currentObject = objectState.get(animation.object);
        if (currentObject === undefined) {
          break;
        }

        objectState.set(animation.object, {
          ...currentObject,
          ...animation.props,
        });
        break;
      }
      case AnimationType.PAUSE:
        elapsedTime += animation.duration;
        break;
      default:
        assertNever(animation);
    }
  }
}
