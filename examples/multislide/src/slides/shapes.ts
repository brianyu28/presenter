/**
 * An example slide demonstrating some sample shapes and their properties.
 */

import { Arrow, Line, Rectangle, Slide } from "presenter";

export default class ShapesSlide extends Slide {
  constructor() {
    const rectangle = new Rectangle({
      width: 800,
      height: 500,
      position: { x: 200, y: 500 },
      fill: "#4b5db7",
    });

    const line = new Line({
      start: { x: 2000, y: 500 },
      end: { x: 2400, y: 1200 },
    });

    const arrow = new Arrow({
      start: { x: 3000, y: 500 },
      end: { x: 3400, y: 1200 },
    });

    super([rectangle, line, arrow]);
  }
}
