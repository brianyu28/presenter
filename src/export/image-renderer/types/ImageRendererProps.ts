import { BrowserCanvasObjectRenderer } from "../../../renderer/browser-canvas/types/BrowserCanvasObjectRenderer";
import { Presentation } from "../../../types/Presentation";
import { SlideObject } from "../../../types/SlideObject";

export interface ImageRendererProps {
  readonly presentation: Presentation;

  /**
   * An animated export includes all frames of animation in the entire presentation.
   * Non-animated exports only include key builds.
   */
  readonly isAnimatedExport: boolean;

  /**
   * The number of frames to hold for each animation step.
   * Applies only to animated exports.
   */
  readonly animationHoldFrames: number;

  /**
   * The number of frames per second for animated exports.
   */
  readonly framesPerSecond: number;

  readonly getFilenameForImage: (imageIndex: number) => string;
  readonly imageFormat: "png" | "jpeg" | "webp" | "svg";
  /** How frequently to log progress frame. */
  readonly logFrequency: number;
  readonly objectRenderers: Record<string, BrowserCanvasObjectRenderer<SlideObject>>;
  readonly resourcePathPrefix: string;
}
