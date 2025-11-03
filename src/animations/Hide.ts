import { SlideObject } from "../types/SlideObject";
import { Update } from "../types/Update";

export function Hide<T extends SlideObject>(object: T): Update<T> {
  return Update(object, { opacity: 0 } as Partial<T>);
}
