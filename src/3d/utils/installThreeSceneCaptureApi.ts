import { ThreeScene } from "../objects/ThreeScene";
import { getRenderedThreeSceneCanvas } from "../renderers/getThreeObjectRenderers";

export interface ThreeSceneCaptureOptions {
  readonly filename?: string;
  readonly imageType?: string;
  readonly quality?: number;
}

export interface InstallThreeSceneCaptureApiOptions {
  readonly scenes: Record<string, ThreeScene>;
}

declare global {
  interface Window {
    presenterCaptureThreeScene?: (
      sceneName: string,
      options?: ThreeSceneCaptureOptions,
    ) => string | null;
  }
}

/**
 * Installs a small console helper for saving fallback images while tuning a live
 * browser presentation. Register stable scene references in your app, view the
 * desired build in the browser, then run `presenterCaptureThreeScene("name")`
 * in DevTools to download the most recently rendered WebGL canvas for that scene.
 */
export function installThreeSceneCaptureApi({ scenes }: InstallThreeSceneCaptureApiOptions): void {
  if (typeof window === "undefined") {
    return;
  }

  window.presenterCaptureThreeScene = (sceneName, options = {}) => {
    const scene = scenes[sceneName];
    if (scene === undefined) {
      console.warn(`No Presenter 3D scene registered with name "${sceneName}".`);
      return null;
    }

    const canvas = getRenderedThreeSceneCanvas(scene);
    if (canvas === null) {
      console.warn(`Presenter 3D scene "${sceneName}" has not been rendered yet.`);
      return null;
    }

    const imageType = options.imageType ?? "image/png";
    const dataUrl = canvas.toDataURL(imageType, options.quality);
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = options.filename ?? `${sceneName}.${getImageExtension(imageType)}`;
    link.click();
    // Previously returned dataUrl, but download is sufficient, don't need console to know data URL
    return null;
  };
}

function getImageExtension(imageType: string): string {
  switch (imageType) {
    case "image/jpeg":
      return "jpg";
    case "image/webp":
      return "webp";
    default:
      return "png";
  }
}
