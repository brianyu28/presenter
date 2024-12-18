/**
 * An example slide with two text elements.
 *
 * Slides can be defined by instantiating a new `Slide` object and passing any
 * objects and animations to it, or by subclassing `Slide`.
 *
 * The advantage of subclassing is that the new class can be instantiated
 * multiple times to create multiple independent slides.
 */

import { Slide, Text } from "presenter";

export default class SimpleSlide extends Slide {
  constructor() {
    const headline = new Text("Welcome to Presenter.js!", {
      position: { x: 200, y: 700 },
      fontSize: 200,
    });

    const subheadline = new Text("Press space to advance to next slide.", {
      position: { x: 200, y: 1200 },
      fontSize: 120,
    });
    super([headline, subheadline]);
  }
}
