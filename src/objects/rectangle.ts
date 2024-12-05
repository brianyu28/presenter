import { ObjectProps, SlideObject } from "../presentation/object";
import { Presentation } from "../presentation/presentation";
import { BoundingBox, Position } from "../util/position";

interface RectangleProps extends ObjectProps {
  color: string;
  width: number;
  height: number;
}

export class Rectangle extends SlideObject {
  props: RectangleProps;

  constructor(props: Partial<RectangleProps> = {}) {
    super({
      color: "#000000",
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
    this.setPositionAttributes(
      presentation,
      new BoundingBox(this.props.position, width, height),
      element,
    );

    return element;
  }

  animateMove(
    position: Position,
    params: anime.AnimeParams,
    presentation: Presentation,
  ) {
    const bbox = new BoundingBox(position, this.props.width, this.props.height);
    this.animate({ bbox, ...params }, presentation);
  }
}
