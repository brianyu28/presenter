import { SlideAnimation } from "./SlideAnimation";
import { SlideObject } from "./SlideObject";

export interface Slide {
  readonly objects: SlideObject[];
  readonly animations: SlideAnimation[];

  readonly shortcut: string | string[] | null;
  readonly title: string;
}

export function Slide(props: Partial<Slide> | null = null): Slide {
  return {
    objects: [],
    animations: [],
    shortcut: null,
    title: "",
    ...props,
  };
}
