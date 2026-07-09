export const ThreeObjectType = {
  BOX: "ThreeBox",
  MODEL: "ThreeModel",
  MODEL_MATERIAL: "ThreeModelMaterial",
  MODEL_NODE: "ThreeModelNode",
  PRESENTER_GROUP: "ThreePresenterGroup",
  SCENE: "ThreeScene",
  SPHERE: "ThreeSphere",
} as const;

export type ThreeObjectType = (typeof ThreeObjectType)[keyof typeof ThreeObjectType];
