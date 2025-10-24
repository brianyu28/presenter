import { Color } from "../../types/Color";
import { Interpolator } from "../../types/Interpolator";

export const interpolateColor: Interpolator<Color> = {
  check: (value: unknown): value is Color => {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof (value as Color).red === "number" &&
      typeof (value as Color).green === "number" &&
      typeof (value as Color).blue === "number" &&
      typeof (value as Color).alpha === "number"
    );
  },
  interpolate: (from: Color, to: Color, proportion: number): Color => {
    return {
      red: Math.round(from.red + (to.red - from.red) * proportion),
      green: Math.round(from.green + (to.green - from.green) * proportion),
      blue: Math.round(from.blue + (to.blue - from.blue) * proportion),
      alpha: from.alpha + (to.alpha - from.alpha) * proportion,
    };
  },
};
