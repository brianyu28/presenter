import { Slide } from "../../types/Slide";
import { SlideAnimation } from "../../types/SlideAnimation";

/**
 * Returns the speaker notes for a slide at a given build index, carrying forward notes from earlier
 * builds if necessary.
 */
export function getSpeakerNotes(slide: Slide, buildIndex: number): string | null {
  for (
    let currentBuildIndex = Math.min(buildIndex, slide.animations.length);
    currentBuildIndex >= 0;
    currentBuildIndex--
  ) {
    const notes = getSpeakerNotesForBuild(slide, currentBuildIndex);
    if (notes !== null) {
      return notes;
    }
  }

  return null;
}

/**
 * Returns only the notes attached directly to a build, without carrying notes forward from an
 * earlier build.
 */
export function getSpeakerNotesForBuild(slide: Slide, buildIndex: number): string | null {
  if (buildIndex === 0) {
    return slide.notes;
  }

  const animation = slide.animations[buildIndex - 1];
  return animation === undefined ? null : getAnimationNotes(animation);
}

/**
 * Returns all notes attached to the inclusive range of builds without carrying notes forward from
 * before the range.
 */
export function getSpeakerNotesForBuildRange(
  slide: Slide,
  startBuildIndex: number,
  endBuildIndex: number,
): string | null {
  const notes: string[] = [];

  for (
    let buildIndex = Math.max(startBuildIndex, 0);
    buildIndex <= Math.min(endBuildIndex, slide.animations.length);
    buildIndex++
  ) {
    const buildNotes = getSpeakerNotesForBuild(slide, buildIndex);
    if (buildNotes !== null) {
      notes.push(buildNotes);
    }
  }

  return notes.length === 0 ? null : notes.join("\n\n");
}

function getAnimationNotes(animation: SlideAnimation): string | null {
  if (!Array.isArray(animation)) {
    return animation.notes;
  }

  const notes = animation
    .map(({ notes }) => notes)
    .filter((notes): notes is string => notes !== null);
  return notes.length > 0 ? notes.join("\n\n") : null;
}
