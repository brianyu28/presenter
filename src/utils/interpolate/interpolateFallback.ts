import { Interpolator } from "../../types/Interpolator";

/** Fallback interpolation function when no other interpolators apply. */
export const interpolateFallback: Interpolator<unknown> = {
  check: (_value: unknown): _value is unknown => {
    return true;
  },
  interpolate: (_from: unknown, to: unknown): unknown => {
    return to;
  },
};
