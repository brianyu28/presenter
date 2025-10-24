import { AnimationType } from "./AnimationType";
import { BaseUnitSlideAnimation } from "./BaseUnitSlideAnimation";

export interface Pause extends BaseUnitSlideAnimation {
  readonly type: typeof AnimationType.PAUSE;
  readonly duration: number;
}

export function Pause(duration: number = 1000): Pause {
  return {
    type: AnimationType.PAUSE,
    isKey: false,
    duration,
    shortcut: null,
  };
}
