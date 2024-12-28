/**
 * An example slide using Presenter's code module. The code module can display
 * code in a monospace font and animate a focused region of text.
 */

import { Slide } from "presenter";
import { CodeBlock } from "presenter/code";
import hello from "../assets/hello.c";

export default class CodeSlide extends Slide {
  constructor() {
    const block = new CodeBlock({
      code: hello,
      length: 0,
      fontFamily: "Menlo",
      fontSize: 130,
      position: { x: 0.5, y: 0.5 },
      anchor: "center",

      // Line height and character width pre-computed with `computePropsForText`
      lineHeight: 130,
      characterWidth: 78.26504,

      // Where focus will be when first animated
      focusLineStart: 1,
      focusLineEnd: 1,
      focusColStart: 1,
      focusColEnd: 8,
    });
    super(
      [block],
      [
        // Animate write-on of all text
        block.animate({ length: null }, { duration: 2000 }),

        // Aniamte showing of focus element
        block.animate({ focusOpacity: 1 }, { duration: 500 }),

        // Animate move of focus
        block.animate(
          {
            focusLineStart: 4,
            focusLineEnd: 4,
            focusColStart: 5,
            focusColEnd: 10,
          },
          { duration: 300 },
        ),
      ],
    );
  }
}
