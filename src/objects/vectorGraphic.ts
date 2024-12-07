import { ObjectProps, SlideObject } from "../presentation/object";
import { Presentation } from "../presentation/presentation";
import { BoundingBox, Position } from "../util/position";

interface VectorGraphicProps extends ObjectProps {
  svg: string;
  width: number;
  height: number;
}

// TODO: Complete this class.
export class VectorGraphic extends SlideObject {
  props: VectorGraphicProps;

  constructor(svg: string, props: Partial<VectorGraphicProps> = {}) {
    super({
      svg,
      width: 100,
      height: 100,
      ...props,
    });
  }

  generate(presentation: Presentation): SVGElement {
    const { width, height, svg } = this.props;

    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svg, "image/svg+xml");
    const element = svgDoc.documentElement as unknown as SVGElement;

    // Set attributes
    // element.innerHTML = svg;
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
