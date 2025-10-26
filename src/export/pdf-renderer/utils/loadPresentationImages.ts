import { readFile } from "fs";
import path from "path";
import { Image } from "skia-canvas";

import { ImageType, UnifiedImage } from "../../../renderer/browser-canvas/types/UnifiedImage";

export async function loadPresentationImages(
  imagePathById: Record<string, string>,
  pathPrefix: string,
): Promise<Record<string, UnifiedImage>> {
  if (Object.keys(imagePathById).length === 0) {
    return {};
  }

  const imageById: Record<string, UnifiedImage> = {};

  const loadImage = (src: string): Promise<Image> => {
    return new Promise((resolve, reject) => {
      readFile(path.join(pathPrefix, src), (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        const img = new Image();
        img.src = data;
        resolve(img);
      });
    });
  };

  const loadPromises = Object.entries(imagePathById).map(async ([id, path]) => {
    const img = await loadImage(path);
    imageById[id] = {
      type: ImageType.Node,
      image: img,
    };
  });

  await Promise.all(loadPromises);

  return imageById;
}
