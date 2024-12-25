/**
 * An example slide demonstrating morphing shape paths into other shapes.
 *
 * `presenter/morph` supports two types of morphs: smooth morph and simple morph.
 *
 * Simple morph performs a direct animation between points on two paths. Both
 * paths must be of the same length and path points must correspond to each
 * other for the animation to look correct.
 *
 * Smooth morph attempts to more intelligently animate between points that may
 * or may not directly correspond. It makes a best-guess estimate at how to
 * interpolate between shapes, and is best when the shapes have different
 * numbers of points or don't correspond as directly.
 */

import { Slide, VectorGraphic } from "presenter";
import { morphPathSmooth, morphPathSimple } from "presenter/morph";

import starSVG from "../assets/star.svg";
import star2SVG from "../assets/star2.svg";
import crossSVG from "../assets/cross.svg";

export default class MorphSlide extends Slide {
  constructor() {
    const shape = new VectorGraphic(starSVG, {
      height: 1000,
      width: 1000,
      position: { x: 0.5, y: 0.5 },
      anchor: "center",
    });

    super(
      [shape],
      [
        /**
         * Draw-on animations allow for animating drawing and filling in
         * the path. Typically this is achieved by giving the shape
         * `fill = "none"` to begin, so that the shape is hidden to start
         * and appears after drawing.
         *
         * For more complex shapes, give paths unique IDs or class names
         * and change the selector argument.
         */
        shape.drawOn("path", { color: "rgb(71, 62, 241)" }),

        /**
         * Simple morph between two star shapes with corresponding points. By
         * default, a spring easing function is used, so we can override the
         * easing to be linear.
         */
        morphPathSimple(
          () => shape.element().querySelector("path"),
          VectorGraphic.svgNode(star2SVG)
            .querySelector("path")
            .getAttribute("d"),
          { duration: 200, easing: "linear" },
        ),

        /**
         * Intelligent morph between two different shapes with different numbers
         * of points. The `maxSegmentLength` controls the smoothness of the
         * animation, and can be adjusted based on what looks visually cleaner
         * and for performance.
         */
        morphPathSmooth(
          () => shape.element().querySelector("path"),
          VectorGraphic.svgNode(crossSVG)
            .querySelector("path")
            .getAttribute("d"),
          { maxSegmentLength: 100 },
        ),
      ],
    );
  }
}
