import { Interpolator } from "../../types/Interpolator";
import { interpolateColor } from "./interpolateColor";
import { interpolateFallback } from "./interpolateFallback";
import { interpolateNumber } from "./interpolateNumber";

export const DEFAULT_INTERPOLATORS: Interpolator<unknown>[] = [
  interpolateNumber,
  interpolateColor,
  interpolateFallback,
];
