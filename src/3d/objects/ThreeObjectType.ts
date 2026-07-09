export const ThreeObjectType = {
  BOX: "ThreeBox",
  MODEL: "ThreeModel",
  MODEL_MATERIAL: "ThreeModelMaterial",
  MODEL_NODE: "ThreeModelNode",
  SCENE: "ThreeScene",
  SPHERE: "ThreeSphere",
} as const;

export type ThreeObjectType = (typeof ThreeObjectType)[keyof typeof ThreeObjectType];
