import { AnimationType } from "./AnimationType";
import { BaseUnitSlideAnimation } from "./BaseUnitSlideAnimation";

export interface Pause extends BaseUnitSlideAnimation {
  readonly type: typeof AnimationType.PAUSE;
  readonly duration: number;
}

export type PauseParams = Partial<Omit<Pause, "duration" | "type">>;

export function Pause(duration: number = 1000, pauseParams: PauseParams = {}): Pause {
  return {
    type: AnimationType.PAUSE,
    isKey: false,
    duration,
    notes: null,
    shortcut: null,
    ...pauseParams,
  };
}
