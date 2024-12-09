import { ObjectProps, SlideObject } from "../presentation/object";
import { BoundingBox } from "../util/position";

export interface RectangleProps extends ObjectProps {
  fill: string;
  width: number;
  height: number;
  rounding: number;
  borderWidth: number;
  borderColor: string;
}

export class Rectangle extends SlideObject<RectangleProps> {
  constructor(props: Partial<RectangleProps> = {}) {
    super({
      fill: "#000000",
      width: 100,
      height: 100,
      rounding: 0,
      borderWidth: 0,
      borderColor: "#000000",
      ...props,
    });
  }

  tagName(): string {
    return "rect";
  }

  attributes(): Partial<Record<string, string>> {
    const {
      position,
      width,
      height,
      fill,
      rounding,
      borderWidth,
      borderColor,
    } = this.props;
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
      ...(borderWidth > 0
        ? {
            "stroke-width": borderWidth.toString(),
            stroke: borderColor,
          }
        : {}),
    };
  }
}
