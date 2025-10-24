import { LOCAL_STORAGE_KEY } from "./storageConsts";
import { StorageState } from "./StorageState";

export function storePresentationState({ title, slideIndex, buildIndex }: StorageState) {
  localStorage.setItem(
    LOCAL_STORAGE_KEY,
    JSON.stringify({ title, slideIndex, buildIndex, timestamp: Date.now() }),
  );
}
