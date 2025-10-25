import { SlideAnimation } from "./SlideAnimation";
import { SlideObject } from "./SlideObject";

export interface Slide {
  readonly objects: SlideObject[];
  readonly animations: SlideAnimation[];

  readonly isEndKey: boolean;
  readonly isStartKey: boolean;
  readonly shortcut: string | string[] | null;
  readonly title: string;
}

export function Slide(props: Partial<Slide> | null = null): Slide {
  return {
    objects: [],
    animations: [],
    isEndKey: true,
    isStartKey: false,
    shortcut: null,
    title: "",
    ...props,
  };
}
