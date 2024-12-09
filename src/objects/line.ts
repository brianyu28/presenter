import { ObjectProps, SlideObject } from "../presentation/object";
import { Position } from "../util/position";

export interface LineProps extends ObjectProps {
  start: Position;
  end: Position;
  color: string;
  width: number;
}

export class Line extends SlideObject<LineProps> {
  constructor(props: Partial<LineProps> = {}) {
    super({
      start: { x: 0, y: 0 },
      end: { x: 100, y: 100 },
      color: "#000000",
      width: 10,
      ...props,
    });
  }

  tagName(): string {
    return "line";
  }

  attributes(): Partial<Record<string, string>> {
    const { color, width } = this.props;
    const start = this.positionInPresentation(this.props.start);
    const end = this.positionInPresentation(this.props.end);

    return {
      ...super.attributes(),
      x1: start.x.toString(),
      y1: start.y.toString(),
      x2: end.x.toString(),
      y2: end.y.toString(),
      stroke: color,
      "stroke-width": width.toString(),
    };
  }
}
