import { SlideObject } from "../types/SlideObject";
import { Update, UpdateParams } from "../types/Update";

export function Hide<T extends SlideObject>(
  object: T,
  updateParams: UpdateParams<T> = {},
): Update<T> {
  return Update(object, { opacity: 0 } as Partial<T>, updateParams);
}
