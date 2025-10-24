import { interpolate } from "flubber";

import { Interpolator } from "../../types/Interpolator";

export function getSmoothPathInterpolator(
  fromPath: string,
  toPath: string,
  maxSegmentLength: number = 3,
): Interpolator<string> {
  const pathInterpolator = interpolate(fromPath, toPath, { maxSegmentLength });

  return {
    check: (value: unknown): value is string => {
      return typeof value === "string";
    },
    interpolate: (_fromPath: string, _toPath: string, proportion: number): string => {
      return pathInterpolator(proportion);
    },
  };
}
