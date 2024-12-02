import { ObjectProps, SlideObject } from "../presentation/object";
import { Theme } from "../presentation/theme";

export class Text extends SlideObject {
  content: string;

  constructor(content: string, props: Partial<ObjectProps> = {}) {
    super(props);
    this.content = content;
  }

  render(theme: Theme): SVGElement {
    const element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text",
    );
    element.innerHTML = this.content;
    return element;
  }
}
