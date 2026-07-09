import { Color } from "../../types/Color";
import { SlideObject } from "../../types/SlideObject";
import { THREE_MESH_DEFAULTS } from "./ThreeMesh";
import { ThreeModelTarget } from "./ThreeModelTarget";
import { ThreeObjectType } from "./ThreeObjectType";

export interface ThreeModelNode extends SlideObject, ThreeModelTarget {
  readonly objectType: typeof ThreeObjectType.MODEL_NODE;

  /** Position offsets added to the matched node's exported local transform. */
  readonly x: number;
  readonly y: number;
  readonly z: number;

  /** Rotation offsets, in degrees, added to the matched node's exported local rotation. */
  readonly rotationX: number;
  readonly rotationY: number;
  readonly rotationZ: number;

  /** Scale multipliers applied to the matched node's exported local scale. */
  readonly scale: number;
  readonly scaleX: number;
  readonly scaleY: number;
  readonly scaleZ: number;

  /** Overrides descendant mesh materials under the matched node. */
  readonly materialColor: Color | null;
  readonly wireframe: boolean;
}

export function ThreeModelNode(props: Partial<ThreeModelNode> | null = null): ThreeModelNode {
  return SlideObject({
    objectType: ThreeObjectType.MODEL_NODE,
    name: null,
    path: null,
    presenterId: null,
    x: THREE_MESH_DEFAULTS.x,
    y: THREE_MESH_DEFAULTS.y,
    z: THREE_MESH_DEFAULTS.z,
    rotationX: THREE_MESH_DEFAULTS.rotationX,
    rotationY: THREE_MESH_DEFAULTS.rotationY,
    rotationZ: THREE_MESH_DEFAULTS.rotationZ,
    scale: THREE_MESH_DEFAULTS.scale,
    scaleX: THREE_MESH_DEFAULTS.scaleX,
    scaleY: THREE_MESH_DEFAULTS.scaleY,
    scaleZ: THREE_MESH_DEFAULTS.scaleZ,
    materialColor: null,
    wireframe: THREE_MESH_DEFAULTS.wireframe,
    ...props,
  });
}
