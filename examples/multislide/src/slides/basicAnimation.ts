/**
 * An example slide demonstrating basic animation techniques. Shows how to
 * animate single properties, animate multiple properties, adjust animation
 * parameters, make changes without animation, and group multiple animations
 * together.
 */

import { Rectangle, Slide, Text } from "presenter";

export default class BasicAnimationSlide extends Slide {
  constructor() {
    const rectangle = new Rectangle({
      width: 800,
      height: 500,
      position: { x: 200, y: 500 },
      fill: "#4b5db7",
    });

    const text = new Text("Hello!", {
      position: { x: 1200, y: 500 },
      fontSize: 120,
    });

    super(
      [rectangle, text],
      [
        // Generate an animation by calling `animate` on any `SlideObject`.
        // Pass as its argument an object with properties that should change.
        text.animate({ position: { x: 1600, y: 500 } }),

        // Optionally, pass in additional information about how the animation
        // should be performed, like its `duration`.
        rectangle.animate({ fill: "#d8856b" }, { duration: 1000 }),

        // Multiple properties can be animated at once.
        rectangle.animate({ width: 1200, height: 700 }),

        // To make a change to an object without animating the change, use `set`
        // instead of `animate`.
        rectangle.set({ fill: "#000000" }),

        // Group multiple animations together in a list for them to be performed together.
        [rectangle.animate({ opacity: 0.5 }), text.animate({ opacity: 0.5 })],
      ],
    );
  }
}
