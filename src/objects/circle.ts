import { ObjectProps, SlideObject } from "../presentation/object";
import { BoundingBox } from "../util/position";

export interface CircleProps extends ObjectProps {
  fill: string;
  radius: number;
  borderWidth: number;
  borderColor: string;
}

export class Circle extends SlideObject<CircleProps> {
  constructor(props: Partial<CircleProps> = {}) {
    super({
      fill: "#000000",
      radius: 100,
      borderWidth: 0,
      borderColor: "#000000",
      ...props,
    });
  }

  tagName(): string {
    return "circle";
  }

  attributes(): Partial<Record<string, string>> {
    const { position, radius, fill, borderWidth, borderColor } = this.props;
    const { x, y } = this.positionAttributes(
      new BoundingBox(position, radius * 2, radius * 2),
    );
    return {
      ...super.attributes(),
      fill,
      r: radius.toString(),
      cx: (x + radius).toString(),
      cy: (y + radius).toString(),
      ...(borderWidth > 0
        ? {
            "stroke-width": borderWidth.toString(),
            stroke: borderColor,
          }
        : {}),
    };
  }
}
