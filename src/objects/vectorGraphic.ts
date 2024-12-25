import { ObjectProps, SlideObject } from "../presentation/object";
import { BuildFunction } from "../util/animation";
import { BoundingBox, Position } from "../util/position";

export interface VectorGraphicProps extends ObjectProps {
  svg: string;
  width: number;
  height: number;
}

interface DrawOnProps {
  color: string;
  strokeWidth: number;
  fill: boolean;
  fillColor: string | null;
  drawDuration: number;
  fillDuration: number;
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

  /**
   * Animates the drawing on of a particular path.
   */
  drawOn(selector: string, props: Partial<DrawOnProps>): BuildFunction {
    const { color, strokeWidth, fill, fillColor, drawDuration, fillDuration } =
      {
        color: "#000000",
        strokeWidth: 5,
        fill: true,
        fillColor: null,
        drawDuration: 1000,
        fillDuration: 1000,
        ...props,
      };

    return (run) => {
      const element = this.element().querySelector(selector) as SVGPathElement;
      if (!element) {
        throw new Error(`Path element with selector ${selector} not found`);
      }
      const pathLength = element.getTotalLength();

      // Set initial path attributes for drawing stroke.
      element.setAttribute("stroke-dashoffset", `${pathLength}`);
      element.setAttribute("stroke-dasharray", `${pathLength}`);
      element.setAttribute("stroke-width", `${strokeWidth}`);
      element.setAttribute("stroke", color);

      // Animate moving of offset to simulate drawing of path.
      run({
        animate: true,
        element,
        attributes: {
          "stroke-dashoffset": "0",
        },
        animationParams: {
          duration: drawDuration,
          easing: "linear",
        },
      });

      // Make sure we want to proceed with fill
      if (!fill) {
        return;
      }

      // Perform animation to fill in the path.
      // Unset stroke-dasharray so that path isn't dashed.
      run({
        animate: true,
        delay: drawDuration,
        element,
        attributes: {
          fill: fillColor ?? color,
          "stroke-dasharray": "none",
        },
        animationParams: {
          duration: fillDuration,
        },
      });
    };
  }
}
