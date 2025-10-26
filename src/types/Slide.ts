import { SlideAnimation } from "./SlideAnimation";
import { SlideObject } from "./SlideObject";

export interface Slide {
  readonly objects: SlideObject[];
  readonly animations: SlideAnimation[];

  readonly isAllKey: boolean;
  readonly isEndKey: boolean;
  readonly isStartKey: boolean;
  readonly shortcut: string | string[] | null;
  readonly title: string;
}

export function Slide(props: Partial<Slide> | null = null): Slide {
  return {
    objects: [],
    animations: [],
    isAllKey: false,
    isEndKey: true,
    isStartKey: false,
    shortcut: null,
    title: "",
    ...props,
  };
}
