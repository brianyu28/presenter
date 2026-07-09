import { SlideObject } from "../../types/SlideObject";
import { THREE_MESH_DEFAULTS, ThreeMesh } from "./ThreeMesh";
import { ThreeObjectType } from "./ThreeObjectType";

export interface ThreePresenterGroup extends ThreeMesh {
  readonly objectType: typeof ThreeObjectType.PRESENTER_GROUP;
  readonly objects: SlideObject[];
  readonly width: number;
  readonly height: number;
  // Width of coordinate system that the group is drawn into
  readonly textureWidth: number | null;
  // Height of coordinate system that the group is drawn into
  readonly textureHeight: number | null;
  readonly doubleSided: boolean;
}

export function ThreePresenterGroup(
  objects: SlideObject[],
  props: Partial<Omit<ThreePresenterGroup, "objects">> | null = null,
): ThreePresenterGroup {
  return SlideObject({
    objectType: ThreeObjectType.PRESENTER_GROUP,
    ...THREE_MESH_DEFAULTS,
    objects,
    width: 1,
    height: 1,
    textureWidth: null,
    textureHeight: null,
    doubleSided: true,
    ...props,
  });
}
