/**
 * An example slide demonstrating different positions for slide objects.
 *
 * A Presenter.js `Position` is represented as an object with `x` and `y`
 * properties. Those `x` and `y` values can be expressed as pixel offsets
 * from the top-left corner of the slide, or as a proportion of the total
 * slide size.
 */

import { Slide, Text } from "presenter";

export default class PositionsSlide extends Slide {
  constructor() {
    const topLeft = new Text("By default, text is anchored to top left.", {
      position: { x: 0, y: 0 },
    });

    const bottomRight = new Text("This text is anchored to the bottom right.", {
      position: { x: 3840, y: 2160 },
      anchor: "bottomright",
    });

    const center = new Text(
      "Position can be expressed as a proportion of total size.",
      {
        position: { x: 0.5, y: 0.5 },
        anchor: "center",
      },
    );

    super([topLeft, bottomRight, center]);
  }
}
