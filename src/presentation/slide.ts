import { SlideObject } from "./object";
import { Presentation } from "./presentation";

export interface SlideProps {}

export class Slide {
  objects: SlideObject[];

  animations: (() => void)[];

  animationIndex: number;

  constructor(objects: SlideObject[], animations: (() => void)[] = []) {
    this.objects = objects.filter((object) => object !== null);
    this.animations = animations;
    this.animationIndex = 0;
  }

  render(presentation: Presentation) {
    // Clear SVG element
    presentation.svg.innerHTML = "";
    this.animationIndex = 0;

    // Render objects
    this.objects.forEach((object) => {
      object._element = object.generate(presentation);
      presentation.svg.appendChild(object.element());
    });
  }

  // Runs next animation and returns true.
  // If no more animations left to run, returns false.
  nextAnimation(): boolean {
    const animation = this.animations[this.animationIndex];
    if (animation) {
      animation();
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
