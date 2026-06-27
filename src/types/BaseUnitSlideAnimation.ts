import { AnimationType } from "./AnimationType";

export interface BaseUnitSlideAnimation {
  readonly type: AnimationType;

  /** Indicates whether this animation is a key animation to be included in exports. */
  readonly isKey: boolean;

  readonly notes: string | null;
  readonly shortcut: string | string[] | null;
}
