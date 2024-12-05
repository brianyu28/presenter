import { ObjectProps, SlideObject } from "../presentation/object";
import { Presentation } from "../presentation/presentation";
import { BoundingBox, Position } from "../util/position";

interface ImageProps extends ObjectProps {
  href: string;
  width: number;
  height: number;
}

export class Image extends SlideObject {
  props: ImageProps;

  constructor(props: Partial<ImageProps> = {}) {
    if (!props.href) {
      throw new Error("Image requires a href");
    }
    super({
      width: 100,
      height: 100,
      ...props,
    });
  }

  generate(presentation: Presentation): SVGElement {
    const { width, height, href } = this.props;
    const element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "image",
    );

    // Set attributes
    element.setAttribute("href", href);
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
