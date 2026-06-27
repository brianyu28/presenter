import { Slide } from "../../types/Slide";
import { SlideAnimation } from "../../types/SlideAnimation";

export function getSpeakerNotes(slide: Slide, buildIndex: number): string | null {
  const lastAnimationIndex = Math.min(buildIndex - 1, slide.animations.length - 1);

  for (let animationIndex = lastAnimationIndex; animationIndex >= 0; animationIndex--) {
    const animation = slide.animations[animationIndex];
    if (animation === undefined) {
      continue;
    }

    const notes = getAnimationNotes(animation);
    if (notes !== null) {
      return notes;
    }
  }

  return slide.notes;
}

function getAnimationNotes(animation: SlideAnimation): string | null {
  if (!Array.isArray(animation)) {
    return animation.notes;
  }

  const notes: string[] = [];
  for (let unitIndex = 0; unitIndex < animation.length; unitIndex++) {
    const unitNotes = animation[unitIndex]?.notes;
    if (unitNotes !== null && unitNotes !== undefined) {
      notes.push(unitNotes);
    }
  }

  return notes.length > 0 ? notes.join("\n\n") : null;
}
