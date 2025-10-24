import { Animate } from "./Animate";
import { Pause } from "./Pause";
import { SlideObject } from "./SlideObject";
import { Update } from "./Update";

export type UnitSlideAnimation = Animate<SlideObject> | Update<SlideObject> | Pause;

export type SlideAnimation = UnitSlideAnimation | UnitSlideAnimation[];
