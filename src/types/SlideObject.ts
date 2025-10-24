import { ObjectType } from "./ObjectType";

export interface SlideObject {
  readonly objectType: string;
  readonly opacity: number;
}

export function SlideObject<T>(props: Partial<SlideObject> & T): SlideObject & T {
  return {
    objectType: ObjectType.SLIDE_OBJECT,
    opacity: 1,
    ...props,
  };
}
