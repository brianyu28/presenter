import { Slide } from "../../types/Slide";

/**
 * Slides can define which builds are considered "key", e.g. to indicate which builds should be included in exports.
 */
export function getKeySlideBuildIndices(slide: Slide): number[] {
  const buildIndices: number[] = [];

  // Slide can configure its own starting state to be key
  if (slide.isStartKey) {
    buildIndices.push(0);
  }

  // Check animations for key build indicators
  slide.animations.forEach((animation, animationIndex) => {
    if (Array.isArray(animation)) {
      if (animation.some((anim) => anim.isKey)) {
        buildIndices.push(animationIndex + 1);
      }
    } else {
      if (animation.isKey) {
        buildIndices.push(animationIndex + 1);
      }
    }
  });

  // Slide can configure its own ending state to be key
  if (slide.isEndKey && buildIndices[buildIndices.length - 1] !== slide.animations.length) {
    buildIndices.push(slide.animations.length);
  }

  return buildIndices;
}
