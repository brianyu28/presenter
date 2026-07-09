import { Color } from "../../types/Color";
import { SlideObject } from "../../types/SlideObject";
import { THREE_MESH_DEFAULTS, ThreeMesh } from "./ThreeMesh";
import { ThreeModelMaterial } from "./ThreeModelMaterial";
import { ThreeModelNode } from "./ThreeModelNode";
import { ThreeObjectType } from "./ThreeObjectType";

export interface ThreeModel extends ThreeMesh {
  readonly objectType: typeof ThreeObjectType.MODEL;
  readonly src: string;

  /** Overrides every material in the imported model. */
  readonly materialColor: Color | null;

  /** Animatable controls for named nodes inside the imported model. */
  readonly nodes: ThreeModelNode[];

  /** Animatable controls for named materials inside the imported model. */
  readonly materials: ThreeModelMaterial[];

  /** Logs available node and material names to the console once the model is loaded. */
  readonly debugNames: boolean;
}

export function ThreeModel(props: Partial<ThreeModel> | null = null): ThreeModel {
  return SlideObject({
    objectType: ThreeObjectType.MODEL,
    ...THREE_MESH_DEFAULTS,
    src: "",
    materialColor: null,
    nodes: [],
    materials: [],
    debugNames: false,
    ...props,
  });
}
