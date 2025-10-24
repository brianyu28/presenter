import { Interpolator } from "../../types/Interpolator";
import { SlideObject } from "../../types/SlideObject";
import { DEFAULT_INTERPOLATORS } from "./defaultInterpolators";

export function interpolate<T extends SlideObject>(
  object: T,
  props: Partial<T>,
  proportion: number,
  customInterpolators: Interpolator<unknown>[] | null = null,
): T {
  if (proportion === 0) {
    return object;
  } else if (proportion === 1) {
    return { ...object, ...props };
  }

  const interpolators =
    customInterpolators != null
      ? [...customInterpolators, ...DEFAULT_INTERPOLATORS]
      : DEFAULT_INTERPOLATORS;

  const interpolatedProps: Partial<T> = {};
  for (const key in props) {
    const fromValue = object[key];
    const toValue = props[key];

    for (const interpolator of interpolators) {
      if (interpolator.check(fromValue, key) && interpolator.check(toValue, key)) {
        interpolatedProps[key] = (interpolator as Interpolator<typeof toValue>).interpolate(
          fromValue,
          toValue,
          proportion,
        );
        break;
      }
    }
  }

  return { ...object, ...interpolatedProps };
}
