export interface ObjectTransform {
  readonly translateX: number;
  readonly translateY: number;
  readonly scale: number;
  // TODO: Add support for rotations in PowerPointRenderer
  readonly rotation: number;
}

export const DEFAULT_OBJECT_TRANSFORM: ObjectTransform = {
  translateX: 0,
  translateY: 0,
  scale: 1,
  rotation: 0,
};
