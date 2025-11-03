import { SlideObject } from "../types/SlideObject";
import { Update } from "../types/Update";

export function Show<T extends SlideObject>(object: T): Update<T> {
  return Update(object, { opacity: 1 } as Partial<T>);
}
