import { ObjectProps, SlideObject } from "../presentation/object";
import { Presentation } from "../presentation/presentation";
import { BoundingBox, Position } from "../util/position";

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
      color: "#000000",
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
    return { x: anchoredBox.origin.x, y: anchoredBox.origin.y + bbox.height };
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
    console.log(bbox);
    this.animate({ bbox, ...params }, presentation);
  }
}
