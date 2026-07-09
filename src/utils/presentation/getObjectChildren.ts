import { SlideObject } from "../../types/SlideObject";

/**
 * Returns the children of a SlideObject if they exist.
 */
export function getObjectChildren(object: SlideObject): SlideObject[] {
  const children: SlideObject[] = [];
  const childContainers = object as SlideObject &
    Partial<Record<"objects" | "meshes" | "nodes" | "materials", unknown>>;

  for (const key of ["objects", "meshes", "nodes", "materials"] as const) {
    const value = childContainers[key];
    if (Array.isArray(value)) {
      children.push(...getSlideObjects(value));
    }
  }
  return children;
}

function getSlideObjects(objects: unknown[]): SlideObject[] {
  return objects.filter(
    (object): object is SlideObject =>
      typeof object === "object" && object !== null && "objectType" in object,
  );
}
