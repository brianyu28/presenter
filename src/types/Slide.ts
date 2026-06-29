import { SlideAnimation } from "./SlideAnimation";
import { SlideObject } from "./SlideObject";
import { SlideWebExtra } from "./SlideWebExtra";

export interface Slide {
  readonly objects: SlideObject[];
  readonly animations: SlideAnimation[];
  readonly extras: SlideWebExtra[];
  /** A screen-reader description of the slide. */
  readonly description: string | null;
  readonly isAllKey: boolean;
  readonly isEndKey: boolean;
  readonly isStartKey: boolean;
  readonly notes: string | null;
  readonly shortcut: string | string[] | null;
  readonly title: string;
}

export function Slide(props: Partial<Slide> | null = null): Slide {
  return {
    objects: [],
    animations: [],
    extras: [],
    description: null,
    isAllKey: false,
    isEndKey: true,
    isStartKey: false,
    notes: null,
    shortcut: null,
    title: "",
    ...props,
  };
}
