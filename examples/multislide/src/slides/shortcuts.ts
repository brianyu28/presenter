/**
 * An example of a slide with keyboard shortcuts to jump directly to the slide.
 */

import { Slide, Text } from "presenter";

export default class ShortcutsSlide extends Slide {
  constructor() {
    const text = new Text(
      [
        "This slide has a shortcut, 'hi'.",
        "From any slide, type 'g' followed by a shortcut name.",
        "Then press enter.",
        "Presenter.js will jump directly to that slide.",
        "Type 'gb' and enter to go back.",
      ],
      {
        position: { x: 200, y: 0.5 },
        anchor: "left",
      },
    );
    super([text], [text.animate({ color: "#0000ff" })], {
      shortcuts: ["hi", ["bye", 1]],
    });
  }
}
