import anime from "animejs/lib/anime.es.js";

/**
 * Data needed to process an animation.
 */
export interface AnimationProps {
  /**
   * Whether to animate the change.
   */
  animate?: boolean;

  element?: HTMLElement | SVGElement;
  attributes?: Record<string, string>;
  styles?: Record<string, string>;
  animationParams?: anime.AnimeParams;
  children?: Node[];

  /**
   * Delay, in milliseconds.
   */
  delay?: number;
}

/**
 * Function that performs an animation on an element.
 */
export type Animator = (
  props: AnimationProps | AnimationProps[],
) => Promise<void>;

/**
 * Function that possibly applies a sequence of animations.
 */
export type BuildFunction = (animate: Animator) => void;

/**
 * Perform an animation on an element.
 * @param props Animation properties.
 */
export const performAnimation: Animator = async (
  props: AnimationProps | AnimationProps[],
) => {
  if (!Array.isArray(props)) {
    props = [props];
  }

  for (const animation of props) {
    // Delay before performing animation.
    if (animation.delay !== undefined) {
      await new Promise((resolve) => setTimeout(resolve, animation.delay));
    }

    // Skip animation if change shouldn't be animated.
    if (animation.animate === false) {
      skipAnimation(animation);
    }

    if (animation.element !== undefined) {
      anime({
        targets: animation.element,
        ...(animation.attributes ?? {}),
        ...(animation.styles ?? {}),
        ...(animation.animationParams ?? {}),
      });

      // Update children if needed.
      if (animation.children) {
        animation.element.innerHTML = "";
        for (const child of animation.children) {
          animation.element.appendChild(child);
        }
      }
    }
  }
};

/**
 * Performs animations by skipping the animation duration and jumping to end of animation.
 * @param props Animation properties.
 */
export const skipAnimation: Animator = async (
  props: AnimationProps | AnimationProps[],
) => {
  if (!Array.isArray(props)) {
    props = [props];
  }

  for (const animation of props) {
    const element = animation.element;
    if (!element) {
      continue;
    }

    // Apply the styles and attributes directly to the element.
    if (animation.attributes) {
      for (const [key, value] of Object.entries(animation.attributes)) {
        element.setAttribute(key, value);
      }
    }
    if (animation.styles) {
      for (const [key, value] of Object.entries(animation.styles)) {
        element.style[key as any] = value;
      }
    }
    if (animation.children) {
      element.innerHTML = "";
      for (const child of animation.children) {
        element.appendChild(child);
      }
    }
  }
};
