export const AnimationType = {
  /** Represents an animated change in an object's properties. */
  ANIMATE: "Animate",

  /** Represents a pause in the animation timeline. */
  PAUSE: "Pause",

  /** Represents an immediate update to an object's properties without animation. */
  UPDATE: "Update",
} as const;

export type AnimationType = (typeof AnimationType)[keyof typeof AnimationType];
