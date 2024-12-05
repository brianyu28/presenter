import { ObjectProps, SlideObject } from "../presentation/object";
import { Presentation } from "../presentation/presentation";

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
    const bbox = this.computeBoundingBox(presentation, width, height);
    element.setAttribute("x", bbox.origin.x.toString());
    element.setAttribute("y", bbox.origin.y.toString());
    return element;
  }
}
