// Tracks whether the navigator should be rebuilt when Vite hot reloads the presentation.
const NAVIGATOR_OPEN_SESSION_KEY = "presenter.navigator.open";

// Detects Vite development mode by looking for Vite's injected HMR client script.
export function isNavigatorHotReloadEnabled(): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  return Array.from(document.scripts).some((script) => script.src.includes("/@vite/client"));
}

// Returns true when an open navigator should be restored after a hot reload.
export function shouldRestoreNavigatorAfterHotReload(): boolean {
  if (!isNavigatorHotReloadEnabled()) {
    return false;
  }

  return getSessionStorage()?.getItem(NAVIGATOR_OPEN_SESSION_KEY) === "true";
}

// Records that the navigator is open so the next Vite reload can rebuild it.
export function markNavigatorOpenForHotReload(): void {
  if (!isNavigatorHotReloadEnabled()) {
    return;
  }

  getSessionStorage()?.setItem(NAVIGATOR_OPEN_SESSION_KEY, "true");
}

// Clears the open-navigator marker when the user closes the navigator.
export function markNavigatorClosedForHotReload(): void {
  getSessionStorage()?.removeItem(NAVIGATOR_OPEN_SESSION_KEY);
}

// Reads sessionStorage defensively in case the browser blocks access.
function getSessionStorage(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}
