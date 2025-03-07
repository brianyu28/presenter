/**
 * An example slide with rich text elements.
 */

import { Slide, Text } from "presenter";

export default class RichTextSlide extends Slide {
  constructor() {
    // Text can be a list of lines.
    // Each line can contain individual text spans that may or may not be styled.
    const text = new Text(
      [
        "This is a rich text element.",
        "Rich text can cross multiple lines.",
        [
          "Rich text can have ",
          ["styling", { fontWeight: "bold", color: "#ff0000" }],
          ".",
        ],
      ],
      {
        position: { x: 200, y: 0.5 },
        anchor: "left",
        fontSize: 100,
        // The `length` property of text specifies how much of the text is visible.
        length: 28,
      },
    );

    super(
      [text],
      [
        // Animating the `length` property can animate adding text up to a particular character.
        text.animate({ length: 63 }),

        // Animating with `length` set to `null` animates all remaining text.
        text.animate({ length: null }),
      ],
    );
  }
}
