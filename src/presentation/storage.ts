import { Presentation } from "./presentation";

const LOCAL_STORAGE_KEY = "presenterState";

export function storePresentationState(presentation: Presentation) {
  const slideIndex = presentation.presentationState.currentSlide;
  const slide = presentation.slides[slideIndex];
  const animationIndex = slide !== null ? slide.animationIndex : 0;
  localStorage.setItem(
    LOCAL_STORAGE_KEY,
    JSON.stringify({
      title: presentation.title,
      slide: slideIndex,
      animation: animationIndex,
      timestamp: Date.now(),
    }),
  );
}

/**
 * Restores the presentation state from the cache, if it exists and isn't older
 * than the cache TTL in minutes.
 *
 * Returns `true` if the presentation state was updated.
 */
export function restorePresentationState(
  presentation: Presentation,
  ttl: number | null,
): boolean {
  const state = localStorage.getItem(LOCAL_STORAGE_KEY);

  // Check if there was a value in local storage.
  if (state === null) {
    return false;
  }

  // Null TTL means don't use any cached data.
  if (ttl === null) {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return false;
  }

  // Check if the value is valid JSON.
  let data;
  try {
    data = JSON.parse(state);
  } catch (e) {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return false;
  }

  let { title, slide: slideIndex, animation, timestamp } = data;

  // If title doesn't match, ignore the cache.
  if (title !== presentation.title) {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return false;
  }

  // Check if the value is older than the cache limit.
  if (Date.now() - timestamp > 1000 * 60 * ttl) {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return false;
  }

  // Validate slide index.
  if (slideIndex > presentation.slides.length - 1) {
    slideIndex = presentation.slides.length - 1;
  }

  const slide = presentation.slides[slideIndex];
  if (slide === undefined) {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return false;
  }

  // Validate animation index.
  if (animation > slide.animations.length) {
    animation = slide.animations.length;
  }

  // Render the presentation.
  presentation.renderSlide(slideIndex, animation);
  return true;
}
