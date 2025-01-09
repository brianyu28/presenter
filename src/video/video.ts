import {
  Presentation,
  PresentationOptions,
} from "../presentation/presentation";
import { Scene } from "./scene";

export interface VideoOptions extends PresentationOptions {
  fps: number;
}

export interface VideoState {
  timestamp: number;
}

export class Video extends Presentation {
  scenes: Scene[];
  videoState: VideoState;

  constructor(
    title: string,
    scenes: Scene[],
    element: HTMLElement,
    options: Partial<VideoOptions> = {},
  ) {
    super(title, [], element, {
      fps: 60,
      ...options,
    });
    this.scenes = scenes;
    this.videoState = {
      timestamp: 0,
    };
  }

  /**
   * Override of the base Presentation validation.
   */
  validatePresentation(): void {
    if (this.element === null) {
      throw new Error("Video cannot be mounted to null element.");
    }
    if (this.scenes.length === 0) {
      throw new Error("Video requires at least one scene.");
    }
  }

  /**
   * Video presentations have no shortcuts.
   */
  setupShortcuts() {}

  /**
   * Start video presentation.
   */
  startPresentation() {
    this.videoState.timestamp = 0;

    // TODO: Remove
    // Temporarily, just render first timestamp.
    this.scenes[0].render(this, 0);
  }
}
