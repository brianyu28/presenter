import { AnimationType } from "./AnimationType";

export interface BaseUnitSlideAnimation {
  readonly type: AnimationType;

  /** Indicates whether this animation is a key animation to be included in exports. */
  readonly isKey: boolean;

  readonly shortcut: string | string[] | null;
}
