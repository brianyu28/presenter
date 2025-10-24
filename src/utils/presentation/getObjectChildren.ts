import { SlideObject } from "../../types/SlideObject";

/**
 * Returns the children of a SlideObject if they exist by checking for an "objects" property.
 */
export function getObjectChildren(object: SlideObject): SlideObject[] {
  return "objects" in object
    ? (object.objects as any).filter((object: any) => "objectType" in object)
    : [];
}
