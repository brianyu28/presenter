import { ObjectType } from "../../types/ObjectType";
import { Presentation } from "../../types/Presentation";
import { SlideObject } from "../../types/SlideObject";
import { getObjectChildren } from "./getObjectChildren";

/**
 * Extracts all SVG objects from slides and returns a mapping from image ID to URL.
 * In the case of SVGs, the image URL and path are both the SVG string itself.
 * SVG strings are transformed into data URLs in the image loading process.
 */
export function getSvgImageUrlById(presentation: Presentation): Record<string, string> {
  const svgStrings: Record<string, string> = {};

  function walkSlideObject(object: SlideObject): void {
    if (object.objectType === ObjectType.SVG) {
      const svg = (object as SlideObject & { svg: string }).svg;
      if (svg !== undefined && svg.length > 0) {
        svgStrings[svg] = svg;
      }
    }

    const children = getObjectChildren(object);
    for (const child of children) {
      walkSlideObject(child);
    }
  }

  for (const slide of presentation.slides) {
    for (const object of slide.objects) {
      walkSlideObject(object);
    }
  }

  return svgStrings;
}
