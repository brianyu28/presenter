import { ObjectProps, SlideObject } from "../presentation/object";
import { BoundingBox, Position } from "../util/position";

export interface VectorGraphicProps extends ObjectProps {
  svg: string;
  width: number;
  height: number;
}

export class VectorGraphic extends SlideObject<VectorGraphicProps> {
  parsedChildren: Node[];

  /**
   * Returns an SVG node given string content.
   */
  static svgNode(content: string): SVGElement {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(content, "image/svg+xml");
    return svgDoc.documentElement as unknown as SVGElement;
  }

  constructor(svg: string, props: Partial<VectorGraphicProps> = {}) {
    super({
      svg,
      width: 100,
      height: 100,
      ...props,
    });
  }

  tagName(): string {
    return "svg";
  }

  createElement(): SVGElement {
    // Get SVG element from string input
    const element = (this.constructor as typeof VectorGraphic).svgNode(
      this.props.svg,
    );

    // Store parsed children.
    this.parsedChildren = Array.from(element.childNodes);
    element.innerHTML = "";

    return element;
  }

  attributes(): Partial<Record<string, string>> {
    const { position, width, height } = this.props;
    const { x, y } = this.positionAttributes(
      new BoundingBox(position, width, height),
    );
    return {
      ...super.attributes(),
      width: width.toString(),
      height: height.toString(),
      x: x.toString(),
      y: y.toString(),
    };
  }

  children(): Node[] {
    return this.parsedChildren;
  }
}
