import { ShortcutState } from "../../../types/ShortcutState";
import { UnifiedImage } from "./UnifiedImage";

export interface BrowserCanvasRendererState {
  canvas: HTMLCanvasElement | null;
  extrasContainer: SVGSVGElement | null;
  mountedExtrasCleanups: (() => void)[];

  /** The index of the currently displayed slide. */
  slideIndex: number;

  /** The index of the current build within the current slide.
   * If there are N animations on the slide, this will range from 0 to N inclusive.
   */
  buildIndex: number;

  /** The ID of the currently running animation, if any. */
  currentAnimationId: number | null;

  imageById: Record<string, UnifiedImage>;

  shortcutState: ShortcutState;
}

export const BROWSER_CANVAS_RENDERER_DEFAULT_STATE: BrowserCanvasRendererState = Object.freeze({
  canvas: null,
  extrasContainer: null,
  mountedExtrasCleanups: [],
  mountedExtrasSlideIndex: null,
  slideIndex: 0,
  buildIndex: 0,
  currentAnimationId: null,
  imageById: {},
  shortcutState: {
    textCommand: null,
    shortcuts: {},
  },
});
