// Tracks the navigator state that should be restored when Vite hot reloads the presentation.
const NAVIGATOR_STATE_SESSION_KEY = "presenter.navigator.state";

export interface NavigatorState {
  readonly open: boolean;
  readonly visibility: {
    readonly slides: boolean;
    readonly current: boolean;
    readonly next: boolean;
    readonly notes: boolean;
  };
}

const DEFAULT_NAVIGATOR_STATE: NavigatorState = {
  open: false,
  visibility: {
    slides: true,
    current: true,
    next: true,
    notes: false,
  },
};

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

  return loadNavigatorStateForHotReload().open;
}

// Records that the navigator is open so the next Vite reload can rebuild it.
export function markNavigatorOpenForHotReload(): void {
  saveNavigatorStateForHotReload({
    ...loadNavigatorStateForHotReload(),
    open: true,
  });
}

// Clears the navigator state when the user closes the navigator.
export function markNavigatorClosedForHotReload(): void {
  getSessionStorage()?.removeItem(NAVIGATOR_STATE_SESSION_KEY);
}

export function loadNavigatorStateForHotReload(): NavigatorState {
  if (!isNavigatorHotReloadEnabled()) {
    return DEFAULT_NAVIGATOR_STATE;
  }

  try {
    const storedState = getSessionStorage()?.getItem(NAVIGATOR_STATE_SESSION_KEY);
    if (storedState === null || storedState === undefined) {
      return DEFAULT_NAVIGATOR_STATE;
    }

    const state = JSON.parse(storedState) as Partial<NavigatorState>;
    return {
      open: typeof state.open === "boolean" ? state.open : DEFAULT_NAVIGATOR_STATE.open,
      visibility: {
        slides:
          typeof state.visibility?.slides === "boolean"
            ? state.visibility.slides
            : DEFAULT_NAVIGATOR_STATE.visibility.slides,
        current:
          typeof state.visibility?.current === "boolean"
            ? state.visibility.current
            : DEFAULT_NAVIGATOR_STATE.visibility.current,
        next:
          typeof state.visibility?.next === "boolean"
            ? state.visibility.next
            : DEFAULT_NAVIGATOR_STATE.visibility.next,
        notes:
          typeof state.visibility?.notes === "boolean"
            ? state.visibility.notes
            : DEFAULT_NAVIGATOR_STATE.visibility.notes,
      },
    };
  } catch {
    return DEFAULT_NAVIGATOR_STATE;
  }
}

export function saveNavigatorStateForHotReload(state: NavigatorState): void {
  if (!isNavigatorHotReloadEnabled()) {
    return;
  }

  getSessionStorage()?.setItem(NAVIGATOR_STATE_SESSION_KEY, JSON.stringify(state));
}

// Reads sessionStorage defensively in case the browser blocks access.
function getSessionStorage(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}
