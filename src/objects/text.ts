import { ObjectProps, SlideObject } from "../presentation/object";
import { Theme } from "../presentation/theme";
import { BoundingBox } from "../util/position";

interface TextProps extends ObjectProps {
  content: string;
  fontStyle: string; // "normal" | "italic" | "bold"
  fontSize: number;
  fontFamily: string;
}

export class Text extends SlideObject {
  props: TextProps;

  constructor(props: Partial<TextProps> = {}) {
    super({
      content: "",
      fontSize: 40,
      fontStyle: "normal",
      fontFamily: "Arial",
      ...props,
    });
  }

  generate(theme: Theme, bounds: BoundingBox): SVGElement {
    const element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text",
    );
    element.innerHTML = this.props.content;
    element.setAttribute("x", this.props.position.x.toString());
    element.setAttribute("y", this.props.position.y.toString());
    element.style.font = `${this.props.fontStyle} ${this.props.fontSize}px ${this.props.fontFamily}`;
    return element;
  }
}
