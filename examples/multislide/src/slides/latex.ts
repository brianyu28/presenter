/**
 * An example slide demonstrating LaTeX.
 *
 * The easiest way to use LaTeX in a presentation is to first use the `vectex`
 * command-line utility included as one of Presenter.js's external packages.
 * This generates an SVG file that can be used in a presentation.
 */

import { Slide, VectorGraphic } from "presenter";
import { morphPathSmooth } from "presenter/morph";

import math1 from "../assets/math1.svg";
import math2 from "../assets/math2.svg";

export default class LatexSlide extends Slide {
  constructor() {
    const equation = new VectorGraphic(math1, {
      height: 400,
      width: 400,
      position: { x: 0.5, y: 0.5 },
      anchor: "center",
    });

    super(
      [equation],
      [
        /**
         * LaTeX expressions can be animated the same way as other SVG elements.
         * Setting the `maxSegmentLength` to a small value ensures a smooth animation.
         */
        morphPathSmooth(
          () => equation.element().querySelector("#g1-50"),
          VectorGraphic.svgNode(math2)
            .querySelector("#g1-51")
            .getAttribute("d"),
          { maxSegmentLength: 0.3 },
        ),
      ],
    );
  }
}
