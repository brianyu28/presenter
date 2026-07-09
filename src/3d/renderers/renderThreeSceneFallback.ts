import { Image } from "../../objects/Image";
import { renderImage } from "../../renderer/browser-canvas/objects/renderImage";
import { BrowserCanvasObjectRenderer } from "../../renderer/browser-canvas/types/BrowserCanvasObjectRenderer";
import { ThreeScene } from "../objects/ThreeScene";

export const renderThreeSceneFallback: BrowserCanvasObjectRenderer<ThreeScene> = (args) => {
  const { object: scene } = args;
  if (scene.fallbackImageId === null) {
    return;
  }

  renderImage({
    ...args,
    object: Image({
      anchor: scene.anchor,
      cornerRadius: scene.fallbackCornerRadius,
      description: scene.description,
      height: scene.height,
      imageId: scene.fallbackImageId,
      opacity: scene.opacity,
      smooth: scene.fallbackSmooth,
      width: scene.width,
      x: scene.x,
      y: scene.y,
    }),
  });
};
