import { ObjectProps, SlideObject } from "../presentation/object";
import { AnimationProps } from "../util/animation";
import { Position } from "../util/position";
import { Line } from "./line";
import { Polygon } from "./polygon";

export interface ArrowProps extends ObjectProps {
  start: Position;
  end: Position;
  color: string;
  width: number;
  arrowSize: number;
}

export class Arrow extends SlideObject<ArrowProps> {
  line: Line | null;
  arrowhead: Polygon | null;

  constructor(props: Partial<ArrowProps> = {}) {
    const width = props.width ?? 10;
    const arrowSize = props.arrowSize ?? width * 4;
    super({
      start: { x: 0, y: 0 },
      end: { x: 100, y: 100 },
      color: "#000000",
      width,
      arrowSize,
      ...props,
    });
    this.line = null;
    this.arrowhead = null;
  }

  tagName(): string {
    return "g";
  }

  /**
   * Computes coordinates for the line and arrowhead of the arrow.
   */
  calculateShapes(props: ArrowProps) {
    const { width, arrowSize } = props;
    const start = this.positionInPresentation(props.start);
    const end = this.positionInPresentation(props.end);

    const angle = Math.atan2(end.y - start.y, end.x - start.x);

    return {
      line: {
        start: start,
        end: {
          x: end.x - (arrowSize / 2) * Math.cos(angle),
          y: end.y - (arrowSize / 2) * Math.sin(angle),
        },
      },
      arrowhead: [
        {
          x: end.x - arrowSize * Math.cos(angle - Math.PI / 6),
          y: end.y - arrowSize * Math.sin(angle - Math.PI / 6),
        },
        end,
        {
          x: end.x - arrowSize * Math.cos(angle + Math.PI / 6),
          y: end.y - arrowSize * Math.sin(angle + Math.PI / 6),
        },
      ],
    };
  }

  children(): Node[] {
    const { color, width, arrowSize } = this.props;
    const start = this.positionInPresentation(this.props.start);
    const end = this.positionInPresentation(this.props.end);

    const angle = Math.atan2(end.y - start.y, end.x - start.x);

    const shapes = this.calculateShapes(this.props);

    // Create line.
    this.line = new Line({
      start: shapes.line.start,
      end: shapes.line.end,
      color,
      width,
    });
    this.line.generate(this._presentation);

    // Create arrow head.
    this.arrowhead = new Polygon(shapes.arrowhead, {
      fill: color,
      borderWidth: 0,
      borderColor: color,
    });
    this.arrowhead.generate(this._presentation);

    return [this.line.element(), this.arrowhead.element()];
  }

  /**
   * Returns animations for changes in arrowhead.
   */
  animations(
    arrowProps: Partial<ArrowProps>,
    animationParams: anime.AnimeParams = {},
  ): AnimationProps[] {
    const newProps = { ...this.props, ...arrowProps };
    const shapes = this.calculateShapes(newProps);

    return [
      this.line.animation(
        {
          start: shapes.line.start,
          end: shapes.line.end,
          ...(arrowProps.color ? { color: arrowProps.color } : {}),
          ...(arrowProps.width ? { width: arrowProps.width } : {}),
        },
        animationParams,
      ),

      this.arrowhead.animation(
        {
          points: shapes.arrowhead,
          ...(arrowProps.color ? { fill: arrowProps.color } : {}),
        },
        animationParams,
      ),
    ];
  }
}
