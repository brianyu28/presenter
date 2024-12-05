import { ObjectProps, SlideObject } from "../presentation/object";
import { Presentation } from "../presentation/presentation";

interface TextProps extends ObjectProps {
  content: string;
  fontStyle: string; // "normal" | "italic" | "bold"
  fontSize: number;
  fontFamily: string;
  color: string;
}

export class Text extends SlideObject {
  props: TextProps;

  constructor(props: Partial<TextProps> = {}) {
    super({
      color: "black",
      content: "",
      fontSize: 40,
      fontStyle: "normal",
      fontFamily: "Arial",
      ...props,
    });
  }

  generate(presentation: Presentation): SVGElement {
    const element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text",
    );
    element.innerHTML = this.props.content;
    element.style.font = `${this.props.fontStyle} ${this.props.fontSize}px ${this.props.fontFamily}`;
    element.style.fill = this.props.color;

    // Position the element. Text coordinates specify the lower-left corner of text baseline.
    const bbox = this.computeRenderedBoundingBox(element, presentation);
    element.setAttribute("x", bbox.origin.x.toString());
    element.setAttribute("y", (bbox.origin.y + bbox.height).toString());
    return element;
  }
}
