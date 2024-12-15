import { ObjectProps, SlideObject } from "../presentation/object";
import { BuildFunction } from "../util/animation";
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
    const { arrowSize } = props;
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
    const { color, width } = this.props;
    const start = this.positionInPresentation(this.props.start);
    const end = this.positionInPresentation(this.props.end);

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

  animate(
    props: Partial<ArrowProps>,
    animationParams: anime.AnimeParams = {},
    delay: number | null = null,
    animate: boolean = true,
  ): BuildFunction {
    const { start, end, color, width, arrowSize, ...objectProps } = props;
    const arrowProps = Object.fromEntries(
      Object.entries({ start, end, color, width, arrowSize }).filter(
        ([_key, value]) => value !== undefined,
      ),
    );
    return (run) => {
      // If we have general object properties to animate (opacity, position,
      // etc.), perform those animations.
      if (Object.keys(objectProps).length !== 0) {
        super.animate(objectProps, animationParams, delay, animate)(run);
      }

      // If we have arrow specific properties to animate, animate those next.
      if (Object.keys(arrowProps).length !== 0) {
        this.animateArrow(arrowProps, animationParams, delay, animate)(run);
      }
    };
  }

  /**
   * Returns animations for changes in arrowhead.
   */
  animateArrow(
    arrowProps: Partial<ArrowProps>,
    animationParams: anime.AnimeParams = {},
    delay: number | null = null,
    animate: boolean = true,
  ): BuildFunction {
    const newProps = { ...this.props, ...arrowProps };
    const shapes = this.calculateShapes(newProps);

    return (run) => {
      const lineAnimation = this.line.animate(
        {
          start: shapes.line.start,
          end: shapes.line.end,
          ...(arrowProps.color ? { color: arrowProps.color } : {}),
          ...(arrowProps.width ? { width: arrowProps.width } : {}),
        },
        animationParams,
      );

      const arrowAnimation = this.arrowhead.animate(
        {
          points: shapes.arrowhead,
          ...(arrowProps.color ? { fill: arrowProps.color } : {}),
        },
        animationParams,
      );

      lineAnimation(run);
      arrowAnimation(run);
    };
  }
}
