import {
  isNavigatorHotReloadEnabled,
  markNavigatorClosedForHotReload,
  markNavigatorOpenForHotReload,
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
});
