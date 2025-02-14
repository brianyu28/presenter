import {
  BuildFunctionSequence,
  performAnimation,
  skipAnimation,
} from "../util/animation";
import { SlideObject } from "./object";
import { Presentation } from "./presentation";
import { storePresentationState } from "./storage";

export interface SlideProps {
  /**
   * An optional title for the slide, shown in navigation bar.
   */
  title: string | null;

  /**
   * Additional HTML element to show behind SVG content.
   */
  additionalElement: HTMLElement | (() => HTMLElement) | null;

  /**
   * A shortcut allows a keyboard shortcut to link directly to a slide.
   * Represented as either just a string (the shortcut),
   * or a string and number (shortcut and animation index).
   */
  shortcuts: (string | [string, number])[];
}

export class Slide {
  objects: SlideObject<any>[];

  animations: BuildFunctionSequence;

  /**
   * Which animation we're set to render next.
   * Slides start with animationIndex = 0.
   */
  animationIndex: number;

  /**
   * Property used by the presenter-export package to note which
   * animations of the slide are meant to be exported.
   * "first", "last", "all", and "none" are special-cased values,
   * otherwise it can be an animationIndex in [0, animations.length].
   */
  keyBuilds: "first" | "last" | "all" | "none" | number[] | null;

  props: SlideProps;

  constructor(
    objects: SlideObject<any>[],
    animations: BuildFunctionSequence = [],
    props: Partial<SlideProps> = {},
  ) {
    this.objects = objects.filter((object) => object !== null);
    this.animations = animations;
    this.animationIndex = 0;
    this.keyBuilds = "last";
    this.props = {
      additionalElement: null,
      shortcuts: [],
      title: null,
      ...props,
    };
  }

  render(presentation: Presentation, animationIndex: number = 0) {
    this.animationIndex = animationIndex;

    // If there are cleanup operations to perform, perform them first.
    for (const cleanupHandler of presentation.slideCleanupHandlers) {
      cleanupHandler();
    }
    presentation.slideCleanupHandlers = [];

    // Generate new objects
    this.objects.forEach((object) => {
      object.generate(presentation);
    });

    // Handle creating additional element if needed.
    presentation.additionalElementContainer.innerHTML = "";
    if (this.props.additionalElement !== null) {
      const element =
        typeof this.props.additionalElement === "function"
          ? this.props.additionalElement()
          : this.props.additionalElement;
      element.style.width = "100%";
      element.style.height = "auto";
      presentation.additionalElementContainer.appendChild(element);
    }

    // Handle non-zero animation index, skipping intermediate animations.
    for (let i = 0; i < this.animationIndex; i++) {
      const animation = this.animations[i];
      if (animation) {
        // If we have a list of build functions, use skip animation on each.
        if (Array.isArray(animation)) {
          for (const animationUnit of animation) {
            if (typeof animationUnit === "number") {
              continue;
            }
            animationUnit(skipAnimation);
          }
        } else {
          animation(skipAnimation);
        }
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
  async nextAnimation(): Promise<boolean> {
    const animation = this.animations[this.animationIndex];
    if (animation) {
      // If we have a list of animations, perform each one.
      if (Array.isArray(animation)) {
        for (const animationUnit of animation) {
          // If animation unit is a delay, then delay.
          if (typeof animationUnit === "number") {
            await new Promise((resolve) => setTimeout(resolve, animationUnit));
            continue;
          }
          animationUnit(performAnimation);
        }
      } else {
        animation(performAnimation);
      }
      this.animationIndex++;
      return true;
    }
    return false;
  }

  /**
   * Returns the build indices that are meant to be exported.
   */
  getKeyBuilds(): number[] {
    if (this.keyBuilds === "first") {
      return [0];
    } else if (this.keyBuilds === "last") {
      return [this.animations.length];
    } else if (this.keyBuilds === "all") {
      return Array.from({ length: this.animations.length + 1 }, (_, i) => i);
    } else if (this.keyBuilds === "none") {
      return [];
    } else if (Array.isArray(this.keyBuilds)) {
      return this.keyBuilds.filter(
        (i) => i >= 0 && i <= this.animations.length,
      );
    } else {
      return [0];
    }
  }
}
