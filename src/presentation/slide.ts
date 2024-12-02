import { SlideObject } from "./object";
import { Theme } from "./theme";

export interface SlideProps {}

export class Slide {
  objects: SlideObject[];

  constructor(objects: SlideObject[]) {
    this.objects = objects;
  }

  render(svg: SVGSVGElement, theme: Theme) {
    // Clear SVG element
    svg.innerHTML = "";

    // Render objects
    this.objects.forEach((object) => {
      const element = object.render(theme);
      svg.appendChild(element);
    });
  }
}
