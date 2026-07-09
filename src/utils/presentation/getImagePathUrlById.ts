import { Presentation } from "../../types/Presentation";
import { SlideObject } from "../../types/SlideObject";
import { getObjectChildren } from "./getObjectChildren";

interface ImagePathObject {
  readonly imagePath?: string | null;
  readonly fallbackImagePath?: string | null;
}

export function getImagePathUrlById(presentation: Presentation): Record<string, string> {
  const imageUrls: Record<string, string> = {};

  function addImagePath(imagePath: string | null | undefined): void {
    if (imagePath !== undefined && imagePath !== null && imagePath.length > 0) {
      imageUrls[imagePath] = imagePath;
    }
  }

  function walkSlideObject(object: SlideObject): void {
    const imageObject = object as SlideObject & ImagePathObject;
    addImagePath(imageObject.imagePath);
    addImagePath(imageObject.fallbackImagePath);

    for (const child of getObjectChildren(object)) {
      walkSlideObject(child);
    }
  }

  for (const slide of presentation.slides) {
    for (const object of slide.objects) {
      walkSlideObject(object);
    }
  }

  return imageUrls;
}
