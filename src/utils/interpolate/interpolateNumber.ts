import { Interpolator } from "../../types/Interpolator";

export const interpolateNumber: Interpolator<number> = {
  check: (value: unknown): value is number => {
    return typeof value === "number";
  },
  interpolate: (from: number, to: number, proportion: number): number => {
    return from + (to - from) * proportion;
  },
};
