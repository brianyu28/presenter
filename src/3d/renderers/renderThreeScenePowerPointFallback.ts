import { renderImage } from "../../export/powerpoint-renderer/objects/renderImage";
import { PowerPointObjectRenderer } from "../../export/powerpoint-renderer/types/PowerPointObjectRenderer";
import { Image } from "../../objects/Image";
import { ThreeScene } from "../objects/ThreeScene";

export const renderThreeScenePowerPointFallback: PowerPointObjectRenderer<ThreeScene> = (args) => {
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
