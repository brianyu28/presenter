import { ObjectType } from "./ObjectType";

export interface SlideObject {
  /** A screen-reader description included while the object is visible. */
  readonly description: string | null;
  readonly objectType: string;
  readonly opacity: number;
}

export function SlideObject<T>(props: Partial<SlideObject> & T): SlideObject & T {
  return {
    description: null,
    objectType: ObjectType.SLIDE_OBJECT,
    opacity: 1,
    ...props,
  };
}
