import { ObjectProps, SlideObject } from "../presentation/object";
import { Presentation } from "../presentation/presentation";
import { BoundingBox } from "../util/position";

interface RectangleProps extends ObjectProps {
  color: string;
  width: number;
  height: number;
}

export class Rectangle extends SlideObject {
  props: RectangleProps;

  constructor(props: Partial<RectangleProps> = {}) {
    super({
      color: "black",
      width: 100,
      height: 100,
      ...props,
    });
  }

  generate(presentation: Presentation): SVGElement {
    const { width, height, color } = this.props;
    const element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect",
    );

    // Set attributes
    element.setAttribute("fill", color);
    element.setAttribute("width", width.toString());
    element.setAttribute("height", height.toString());

    // Position the element.
    const bbox = this.computeBoundingBox(presentation, width, height);
    element.setAttribute("x", bbox.origin.x.toString());
    element.setAttribute("y", bbox.origin.y.toString());
    return element;
  }
}
