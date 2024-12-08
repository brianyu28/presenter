import { ObjectProps, SlideObject } from "../presentation/object";
import { BoundingBox } from "../util/position";

interface RectangleProps extends ObjectProps {
  fill: string;
  width: number;
  height: number;
  rounding: number;
}

export class Rectangle extends SlideObject<RectangleProps> {
  constructor(props: Partial<RectangleProps> = {}) {
    super({
      fill: "#000000",
      width: 100,
      height: 100,
      rounding: 0,
      ...props,
    });
  }

  tagName(): string {
    return "rect";
  }

  attributes(): Partial<Record<string, string>> {
    const { position, width, height, fill, rounding } = this.props;
    const { x, y } = this.positionAttributes(
      new BoundingBox(position, width, height),
    );
    return {
      ...super.attributes(),
      fill,
      width: width.toString(),
      height: height.toString(),
      rx: rounding.toString(),
      x: x.toString(),
      y: y.toString(),
    };
  }
}
