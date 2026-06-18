import {
  isNavigatorHotReloadEnabled,
  loadNavigatorStateForHotReload,
  markNavigatorClosedForHotReload,
  markNavigatorOpenForHotReload,
  saveNavigatorStateForHotReload,
  shouldRestoreNavigatorAfterHotReload,
} from "./navigatorHotReload";

describe("navigatorHotReload", () => {
  beforeEach(() => {
    document.head.replaceChildren();
    sessionStorage.clear();
  });

  test("does not track navigator state outside Vite development", () => {
    markNavigatorOpenForHotReload();

    expect(isNavigatorHotReloadEnabled()).toBe(false);
    expect(shouldRestoreNavigatorAfterHotReload()).toBe(false);
    expect(sessionStorage.length).toBe(0);
  });

  test("tracks navigator state when Vite HMR is present", () => {
    const viteClientScript = document.createElement("script");
    viteClientScript.src = "http://localhost:5173/@vite/client";
    document.head.appendChild(viteClientScript);

    markNavigatorOpenForHotReload();

    expect(isNavigatorHotReloadEnabled()).toBe(true);
    expect(shouldRestoreNavigatorAfterHotReload()).toBe(true);

    markNavigatorClosedForHotReload();

    expect(shouldRestoreNavigatorAfterHotReload()).toBe(false);
  });

  test("preserves navigator visibility state", () => {
    const viteClientScript = document.createElement("script");
    viteClientScript.src = "http://localhost:5173/@vite/client";
    document.head.appendChild(viteClientScript);

    saveNavigatorStateForHotReload({
      open: true,
      visibility: {
        slides: false,
        current: true,
        next: false,
      },
    });

    expect(loadNavigatorStateForHotReload()).toEqual({
      open: true,
      visibility: {
        slides: false,
        current: true,
        next: false,
      },
    });

    markNavigatorOpenForHotReload();

    expect(loadNavigatorStateForHotReload().visibility).toEqual({
      slides: false,
      current: true,
      next: false,
    });
  });
});
