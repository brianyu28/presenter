import {
  BuildFunction,
  performAnimation,
  skipAnimation,
} from "../util/animation";
import { SlideObject } from "./object";
import { Presentation } from "./presentation";

export interface SlideProps {}

export class Slide {
  objects: SlideObject<any>[];

  animations: BuildFunction[];

  animationIndex: number;

  constructor(objects: SlideObject<any>[], animations: BuildFunction[] = []) {
    this.objects = objects.filter((object) => object !== null);
    this.animations = animations;
    this.animationIndex = 0;
  }

  render(presentation: Presentation, animationIndex: number = 0) {
    this.animationIndex = animationIndex;

    // Generate new objects
    this.objects.forEach((object) => {
      object.generate(presentation);
    });

    // Handle non-zero animation index, skipping intermediate animations.
    for (let i = 0; i < this.animationIndex; i++) {
      const animation = this.animations[i];
      if (animation) {
        animation(skipAnimation);
      }
    }

    // Clear SVG element
    presentation.svg.innerHTML = "";

    // Append objects to SVG
    this.objects.forEach((object) => {
      presentation.svg.appendChild(object.element());
    });
  }

  // Runs next animation and returns true.
  // If no more animations left to run, returns false.
  nextAnimation(presentation: Presentation): boolean {
    const animation = this.animations[this.animationIndex];
    if (animation) {
      animation(performAnimation);
      this.animationIndex++;
      return true;
    }
    return false;
  }

  /**
   * Sleep for a specified number of milliseconds in an animation.
   */
  async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
