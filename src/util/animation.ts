import anime from "animejs/lib/anime.es.js";

export { anime };

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

  /**
   * An animation can also specify custom functions that can be called to
   * perform an animation or update to the end state of the animation.
   */
  animateCallback?: () => void;
  updateCallback?: () => void;
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

    // If there's a function associated with the animation, run that.
    if (animation.animateCallback !== undefined) {
      animation.animateCallback();
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
    // If there's a function associated with skipping the animation, call it.
    if (animation.updateCallback) {
      animation.updateCallback();
    }

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

/**
 * When performing animations on non-DOM elements, e.g. variables in the state
 * of a Three.js scene, we need a unchanging reference to state that may get
 * replaced. That state can hold any type.
 */
export interface StateContainer<T> {
  state: T;
}

export function stateChangeAnimation<T>(
  state: StateContainer<T>,
  finalState: Partial<T>,
  duration: number = 500,
): AnimationProps {
  const animationKeys: (keyof T)[] = Object.keys(finalState) as (keyof T)[];
  let startTime: number | null = null;
  const startState: T = { ...state.state };

  function animateCallback(timestamp: number) {
    if (startTime === null) {
      startTime = timestamp;
    }
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);

    for (const key of animationKeys) {
      if (typeof finalState[key] === "number") {
        const startValue = startState[key] as number;
        const endValue = finalState[key] as number;
        state.state[key] = (startValue +
          progress * (endValue - startValue)) as any;
      } else if (progress == 1) {
        // If it's a non-numeric property, then just animate at the end.
        state.state[key] = finalState[key];
      }
    }

    if (progress < 1) {
      requestAnimationFrame(animateCallback);
    }
  }
  return {
    animateCallback: () => {
      requestAnimationFrame(animateCallback);
    },
    updateCallback: () => {
      for (const key of animationKeys) {
        state.state[key] = finalState[key];
      }
    },
  };
}

export function animateStateChange<T>(
  state: StateContainer<T>,
  finalState: Partial<T>,
  duration: number = 500,
): BuildFunction {
  return (run) => {
    run(stateChangeAnimation(state, finalState, duration));
  };
}
