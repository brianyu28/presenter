import { ObjectProps, SlideObject } from "../presentation/object";
import { Presentation } from "../presentation/presentation";
import { BoundingBox, Position } from "../util/position";

interface TextProps extends ObjectProps {
  content: string;
  fontStyle: string; // "normal" | "italic" | "bold"
  fontSize: number;
  fontFamily: string;
  color: string;
  dominantBaseline: string;
}

export class Text extends SlideObject {
  props: TextProps;

  constructor(props: Partial<TextProps> = {}) {
    super({
      color: "#000000",
      content: "",
      fontSize: 150,
      fontStyle: "normal",
      fontFamily: "primary",
      dominantBaseline: "ideographic",
      ...props,
    });
  }

  generate(presentation: Presentation): SVGElement {
    const fontFamily = this.getFont(this.props.fontFamily, presentation);

    const element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text",
    );
    element.innerHTML = this.props.content;
    element.style.font = `${this.props.fontStyle} ${this.props.fontSize}px ${fontFamily}`;
    element.style.fill = this.props.color;

    // Position the element. Text coordinates specify the lower-left corner of text baseline.
    this.setPositionAttributes(
      presentation,
      this.computeRenderedBoundingBox(element, presentation, true),
      element,
    );

    return element;
  }

  computePositionAttributes(
    presentation: Presentation,
    bbox: BoundingBox,
  ): any {
    const { x, y } = this.positionInPresentation(
      presentation,
      bbox.origin.x,
      bbox.origin.y,
    );
    const anchoredBox = this.anchorBoundingBox(
      new BoundingBox({ x, y }, bbox.width, bbox.height),
    );
    return {
      x: anchoredBox.origin.x,
      y: anchoredBox.origin.y + bbox.height,
      "dominant-baseline": this.props.dominantBaseline,
    };
  }

  animateMove(
    position: Position,
    params: anime.AnimeParams,
    presentation: Presentation,
  ) {
    const renderedBBox = this.computeRenderedBoundingBox(
      this.element() as SVGGraphicsElement,
      presentation,
      true,
    );
    const bbox = new BoundingBox(
      position,
      renderedBBox.width,
      renderedBBox.height,
    );
    this.animate({ bbox, ...params }, presentation);
  }

  /**
   * If the font is defined in the theme, return the font name from the theme.
   * Otherwise, return the font name as is.
   */
  getFont(name: string, presentation: Presentation) {
    if (presentation.options.theme.text.fonts[name]) {
      return presentation.options.theme.text.fonts[name];
    }
    return name;
  }
}
