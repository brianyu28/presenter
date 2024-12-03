import { SlideObject } from "./object";
import { Presentation } from "./presentation";

export interface SlideProps {}

export class Slide {
  objects: SlideObject[];

  constructor(objects: SlideObject[]) {
    this.objects = objects;
  }

  render(presentation: Presentation) {
    // Clear SVG element
    presentation.svg.innerHTML = "";

    // Render objects
    this.objects.forEach((object) => {
      object._element = object.generate(
        presentation.options.theme,
        presentation.boundingBox,
      );
      presentation.svg.appendChild(object.element());
    });
  }
}
