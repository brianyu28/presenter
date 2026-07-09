export const ThreeCameraType = {
  ORTHOGRAPHIC: "Orthographic",
  PERSPECTIVE: "Perspective",
} as const;

export type ThreeCameraType = (typeof ThreeCameraType)[keyof typeof ThreeCameraType];
