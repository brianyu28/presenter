import { Presentation } from "../../types/Presentation";
import { LOCAL_STORAGE_KEY } from "./storageConsts";
import { StorageState } from "./StorageState";

export function loadPresentationState(
  presentation: Presentation,
  ttlMinutes: number | null,
): StorageState | null {
  const state = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (state === null) {
    return null;
  }

  // If no TTL is provided, don't use any cached data.
  if (ttlMinutes === null) {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return null;
  }

  // Check if the value is valid JSON.
  let data: unknown;
  try {
    data = JSON.parse(state);
  } catch (error) {
    console.error("Failed to parse presentation state from localStorage:", error);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return null;
  }

  const { title, timestamp } = data as any;
  let { slideIndex, buildIndex } = data as any;

  if (
    typeof title !== "string" ||
    typeof slideIndex !== "number" ||
    typeof buildIndex !== "number" ||
    typeof timestamp !== "number"
  ) {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return null;
  }

  // If title doesn't match, ignore the cache.
  if (title !== presentation.title) {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return null;
  }

  // Check if the value is older than the cache limit.
  if (Date.now() - timestamp > 1000 * 60 * ttlMinutes) {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return null;
  }

  // Validate slide index
  if (slideIndex > presentation.slides.length - 1) {
    slideIndex = presentation.slides.length - 1;
    buildIndex = 0;
  }

  const slide = presentation.slides[slideIndex];
  if (slide === undefined) {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return null;
  }

  // Validate build index
  if (buildIndex > slide.animations.length) {
    buildIndex = slide.animations.length;
  }

  return {
    title,
    slideIndex,
    buildIndex,
  };
}
