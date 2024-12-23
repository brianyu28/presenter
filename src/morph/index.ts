import { interpolate as interpolatePathSmooth } from "flubber";

import { BuildFunction } from "../util/animation";
import { easeCubic } from "../util/easing";

export interface MorphParams {
  duration: number;

  /**
   * For smooth morph, we can define a maximum size for segments to use in
   * interpolated animation. Lower values result in smoother animations, but
   * are potentially less performant.
   *
   * Default is 10.
   */
  maxSegmentLength: number;

  /**
   * For simple morph, easing is meant to be a string.
   * For smooth morph, easing is meant to be a function over [0, 1].
   */
  easing: string | ((value: number) => number);
}

/**
 * Generates an animation that morphs one path into another, given a path
 * interpolation function that computes intermediate path values.
 */
export function morphPath(
  sourceElement: Element | (() => Element),
  targetPath: string,
  pathInterpolator: (source: string, target: string) => (t: number) => string,
  morphParams: Partial<MorphParams>,
): BuildFunction {
  let startTime: number | null = null;
  let element: Element | null = null;
  let interpolator: ((t: number) => string) | null = null;

  const duration = "duration" in morphParams ? morphParams.duration : 500;
  const easingFunction =
    "easing" in morphParams && typeof morphParams.easing === "function"
      ? morphParams.easing
      : easeCubic;

  function animateCallback(timestamp: number) {
    // On first setup, need the start time, the source element, and the interpolator.
    if (startTime === null) {
      startTime = timestamp;
    }
    if (element === null) {
      // Source element can be a function because at the time the build
      // function is created, we might not have access to the element yet.
      element =
        typeof sourceElement === "function" ? sourceElement() : sourceElement;
    }
    if (interpolator === null) {
      interpolator = pathInterpolator(element.getAttribute("d"), targetPath);
    }

    // Subsequently, compute an interpolated path based on how far we should
    // be in the morph between two paths.
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const t = easingFunction(progress);
    const interpolatedPath = interpolator(t);
    element.setAttribute("d", interpolatedPath);

    if (progress < 1) {
      requestAnimationFrame(animateCallback);
    }
  }
  return (run) =>
    run({
      animate: true,
      animateCallback: () => {
        startTime = null;
        element = null;
        interpolator = null;
        requestAnimationFrame(animateCallback);
      },
      updateCallback: () => {
        const element =
          typeof sourceElement === "function" ? sourceElement() : sourceElement;
        element.setAttribute("d", targetPath);
      },
    });
}

/**
 * Smoothly morphs one path into another. Attempts to intelligently
 * interpolate between shapes smoothly, even if shapes don't correspond to
 * each other closely or don't have the same number of points.
 */
export function morphPathSmooth(
  sourceElement: Element | (() => Element),
  targetPath: string,
  morphParams: Partial<MorphParams> = {},
): BuildFunction {
  const interpolate = (source: string, target: string) => {
    return interpolatePathSmooth(source, target, {
      maxSegmentLength: morphParams.maxSegmentLength ?? 10,
    });
  };
  return morphPath(sourceElement, targetPath, interpolate, morphParams);
}

/**
 * Simply morphs one path into another. Points are translated directly, and
 * both paths must have the same number of points for the animation to look
 * correct. Works best if two paths correspond to each other closely.
 */
export function morphPathSimple(
  sourceElement: Element | (() => Element),
  targetPath: string,
  morphParams: Partial<MorphParams> = {},
): BuildFunction {
  const duration = "duration" in morphParams ? morphParams.duration : 500;
  const easing =
    "easing" in morphParams && typeof morphParams.easing === "string"
      ? morphParams.easing
      : null;

  return (run) => {
    const element = (
      typeof sourceElement === "function" ? sourceElement() : sourceElement
    ) as SVGElement;
    run({
      animate: true,
      element,
      animationParams: {
        d: targetPath,
        duration,
        ...(easing !== null ? { easing } : {}),
      },
      updateCallback: () => {
        element.setAttribute("d", targetPath);
      },
    });
  };
}
