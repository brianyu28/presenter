import { SlideObject } from "../../types/SlideObject";
import { THREE_MESH_DEFAULTS, ThreeMesh } from "./ThreeMesh";
import { ThreeObjectType } from "./ThreeObjectType";

export interface ThreeSphere extends ThreeMesh {
  readonly objectType: typeof ThreeObjectType.SPHERE;
  readonly radius: number;
  readonly widthSegments: number;
  readonly heightSegments: number;
}

export function ThreeSphere(props: Partial<ThreeSphere> | null = null): ThreeSphere {
  return SlideObject({
    objectType: ThreeObjectType.SPHERE,
    ...THREE_MESH_DEFAULTS,
    radius: 1,
    widthSegments: 32,
    heightSegments: 16,
    ...props,
  });
}
