import { SlideObject } from "../types/SlideObject";
import { Update, UpdateParams } from "../types/Update";

export function Show<T extends SlideObject>(
  object: T,
  updateParams: UpdateParams<T> = {},
): Update<T> {
  return Update(object, { opacity: 1 } as Partial<T>, updateParams);
}
