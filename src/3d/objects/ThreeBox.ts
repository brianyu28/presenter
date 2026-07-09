import { SlideObject } from "../../types/SlideObject";
import { THREE_MESH_DEFAULTS, ThreeMesh } from "./ThreeMesh";
import { ThreeObjectType } from "./ThreeObjectType";

export interface ThreeBox extends ThreeMesh {
  readonly objectType: typeof ThreeObjectType.BOX;
  readonly width: number;
  readonly height: number;
  readonly depth: number;
}

export function ThreeBox(props: Partial<ThreeBox> | null = null): ThreeBox {
  return SlideObject({
    objectType: ThreeObjectType.BOX,
    ...THREE_MESH_DEFAULTS,
    width: 1,
    height: 1,
    depth: 1,
    ...props,
  });
}
