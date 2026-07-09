import { Color } from "../../types/Color";
import { SlideObject } from "../../types/SlideObject";
import { ThreeModelTarget } from "./ThreeModelTarget";
import { ThreeObjectType } from "./ThreeObjectType";

export interface ThreeModelMaterial extends SlideObject, Omit<ThreeModelTarget, "path"> {
  readonly objectType: typeof ThreeObjectType.MODEL_MATERIAL;

  /** Overrides each matching material's color while preserving other material properties. */
  readonly materialColor: Color | null;
  readonly wireframe: boolean;
}

export function ThreeModelMaterial(
  props: Partial<ThreeModelMaterial> | null = null,
): ThreeModelMaterial {
  return SlideObject({
    objectType: ThreeObjectType.MODEL_MATERIAL,
    name: null,
    presenterId: null,
    materialColor: null,
    wireframe: false,
    ...props,
  });
}
