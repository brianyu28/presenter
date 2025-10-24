import { easeBackInOut, easeCubic, easeCubicIn, easeCubicOut } from "d3-ease";

import { EasingFunction } from "./EasingFunction";

export const Easing = {
  LINEAR: (t: number) => t,
  CUBIC: easeCubic,
  CUBIC_IN: easeCubicIn,
  CUBIC_OUT: easeCubicOut,
  BACK_IN_OUT: easeBackInOut.overshoot(0.8),
} as const satisfies Record<string, EasingFunction>;

export const DEFAULT_EASING: EasingFunction = Easing.LINEAR;
