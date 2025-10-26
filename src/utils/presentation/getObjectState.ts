import { Slide } from "../../types/Slide";
import { SlideObject } from "../../types/SlideObject";
import { updateObjectStateWithAnimation } from "../animate/updateObjectStateWithAnimation";
import { getObjectChildren } from "./getObjectChildren";

interface Args {
  readonly slide: Slide;
  readonly buildIndex: number;
  readonly buildTime: number | null;
}

/**
 * Returns a mapping from original object (by reference equality) to its current state.
 */
export function getObjectState({
  slide,
  buildIndex,
  buildTime,
}: Args): Map<SlideObject, SlideObject> {
  const objectState: Map<SlideObject, SlideObject> = new Map();

  function addObjectToState(object: SlideObject) {
    objectState.set(object, object);
    for (const childObject of getObjectChildren(object)) {
      addObjectToState(childObject);
    }
  }

  for (const object of slide.objects) {
    addObjectToState(object);
  }

  // Process animations that have already completed.
  const completedBuildCount = buildTime === null ? buildIndex : buildIndex - 1;
  for (let i = 0; i < completedBuildCount; i++) {
    const animation = slide.animations[i] ?? null;
    updateObjectStateWithAnimation(objectState, animation);
  }

  // Process the current animation, if any.
  if (buildTime !== null && buildIndex > 0) {
    const animation = slide.animations[buildIndex - 1] ?? null;
    updateObjectStateWithAnimation(objectState, animation, buildTime);
  }

  return objectState;
}
