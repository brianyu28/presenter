import { ObjectProps, SlideObject } from "../presentation/object";
import { BuildFunction } from "../util/animation";
import { Position } from "../util/position";
import { Line } from "./line";
import { Path } from "./path";
import { Polygon } from "./polygon";

export interface ArrowProps extends ObjectProps {
  start: Position;
  end: Position;
  color: string;
  width: number;
  arrowSize: number;

  // Arrowhead can be filled or unfilled, can also be doubled.
  filledHead: boolean;
  doubledHead: boolean;
  growFromCenter: boolean;

  /**
   * Property describing whether the arrow has been fully drawn.
   * If an arrow hasn't been drawn, it can be animated to draw in.
   */
  drawn: boolean;

  /**
   * The start and end points can have "padding".
   * This is equivalent to adding (x, y) values to the start and end points.
   *
   * This can be useful when drawing an arrow from an object at a particular
   * location. The arrow's start/end point can match the object's, with some
   * added padding so that the arrow doesn't overlap the object.
   *
   * It can also be useful if multiple arrows start or end at the same place,
   * and you want to adjust their endpoints slightly to avoid overlap.
   */
  padStart: Partial<Position>;
  padEnd: Partial<Position>;
}

export class Arrow extends SlideObject<ArrowProps> {
  line: Line | null;
  arrowhead: Polygon | Path | null;
  doubledArrowhead: Polygon | Path | null;

  constructor(props: Partial<ArrowProps> = {}) {
    const width = props.width ?? 10;
    const arrowSize = props.arrowSize ?? width * 4;

    // By default, if the arrow is created with `drawn: false`,
    // set the opacity to 0 unless otherwise indicated.
    const opacity = props.opacity ?? (props.drawn === false ? 0 : 1);

    super({
      start: { x: 0, y: 0 },
      end: { x: 100, y: 100 },
      color: "#000000",
      width,
      arrowSize,
      opacity,
      filledHead: true,
      doubledHead: false,
      drawn: true,
      padStart: { x: 0, y: 0 },
      padEnd: { x: 0, y: 0 },
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
    const { arrowSize, drawn, doubledHead, filledHead, growFromCenter } = props;
    let start = this.positionInPresentation(props.start);
    const end = this.positionInPresentation(props.end);

    // Adjust start and end points for padding.
    start.x += props.padStart.x ?? 0;
    start.y += props.padStart.y ?? 0;
    end.x += props.padEnd.x ?? 0;
    end.y += props.padEnd.y ?? 0;

    const angle = Math.atan2(end.y - start.y, end.x - start.x);

    const midpoint: Position = {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2,
    };

    const undrawnLineStart = growFromCenter ? midpoint : start;

    // The arrow head will have three points.
    // The first point (headPoint) is the tip of the arrowhead.
    // For a drawn arrow, this is equivalent to the end of the arrow.
    //
    // Depending on whether the arrow has been drawn or not, the head position
    // might be at the start or end of the line.
    const headPoint = drawn
      ? end
      : {
          x: undrawnLineStart.x + arrowSize * Math.cos(angle),
          y: undrawnLineStart.y + arrowSize * Math.sin(angle),
        };

    // Arrow angle varies depending on filled or unfilled head
    const arrowAngle = filledHead ? Math.PI / 6 : Math.PI / 4.5;

    // The other two points of the head make up the base of the triangle.
    const headBase1 = {
      x: headPoint.x - arrowSize * Math.cos(angle - arrowAngle),
      y: headPoint.y - arrowSize * Math.sin(angle - arrowAngle),
    };

    const headBase2 = {
      x: headPoint.x - arrowSize * Math.cos(angle + arrowAngle),
      y: headPoint.y - arrowSize * Math.sin(angle + arrowAngle),
    };

    // If the arrowhead is filled, the line should pull back slightly to not overlap head polygon.
    // Otherwise, if the arrowhead is unfilled, don't pull back.
    const linePullback = props.filledHead ? (2 * arrowSize) / 3 : 0;

    // The line should end before it overlaps the arrow.
    // If the arrow isn't drawn yet, use the end point as start point.
    const lineEnd = drawn
      ? {
          x: end.x - linePullback * Math.cos(angle),
          y: end.y - linePullback * Math.sin(angle),
        }
      : // Start arrow's line end a little before the arrowhead, to avoid overlap issues.
        {
          x: undrawnLineStart.x + 0.8 * arrowSize * Math.cos(angle),
          y: undrawnLineStart.y + 0.8 * arrowSize * Math.sin(angle),
        };

    const doubledArrowhead: Position[] = [];

    // If we need two arrow heads, calculate those positions.
    if (doubledHead) {
      const doubledHeadPoint = drawn ? start : undrawnLineStart;

      const doubledHeadBase1 = {
        x: doubledHeadPoint.x + arrowSize * Math.cos(angle - arrowAngle),
        y: doubledHeadPoint.y + arrowSize * Math.sin(angle - arrowAngle),
      };

      const doubledHeadBase2 = {
        x: doubledHeadPoint.x + arrowSize * Math.cos(angle + arrowAngle),
        y: doubledHeadPoint.y + arrowSize * Math.sin(angle + arrowAngle),
      };

      doubledArrowhead.push(
        doubledHeadBase1,
        doubledHeadPoint,
        doubledHeadBase2,
      );

      // For a filled-head doubled arrow, we need to pull back the start of the line,
      // otherwise the start of the line overlaps with the arrow polygon.
      if (filledHead) {
        start = {
          x: start.x + linePullback * Math.cos(angle),
          y: start.y + linePullback * Math.sin(angle),
        };
      }
    }

    const lineStart =
      !drawn && growFromCenter
        ? {
            x: undrawnLineStart.x + linePullback * Math.cos(angle),
            y: undrawnLineStart.y + linePullback * Math.sin(angle),
          }
        : start;

    return {
      line: { start: lineStart, end: lineEnd },
      arrowhead: [headBase1, headPoint, headBase2],
      doubledArrowhead,
    };
  }

  children(): Node[] {
    const { color, width, filledHead, doubledHead } = this.props;

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
    this.arrowhead = filledHead
      ? new Polygon(shapes.arrowhead, {
          fill: color,
          borderWidth: 0,
          borderColor: color,
        })
      : new Path({
          points: shapes.arrowhead,
          color,
          width,
        });
    this.arrowhead.generate(this._presentation);

    // Create doubled arrowhead if needed.
    if (doubledHead) {
      this.doubledArrowhead = filledHead
        ? new Polygon(shapes.doubledArrowhead, {
            fill: color,
            borderWidth: 0,
            borderColor: color,
          })
        : new Path({
            points: shapes.doubledArrowhead,
            color,
            width,
          });
      this.doubledArrowhead.generate(this._presentation);
    }

    return [
      this.line.element(),
      this.arrowhead.element(),
      ...(this.doubledArrowhead ? [this.doubledArrowhead.element()] : []),
    ];
  }

  animate(
    props: Partial<ArrowProps>,
    animationParams: anime.AnimeParams = {},
    delay: number | null = null,
    animate: boolean = true,
  ): BuildFunction {
    const { start, end, drawn, color, width, arrowSize, ...objectProps } =
      props;
    const arrowProps = Object.fromEntries(
      Object.entries({ start, end, drawn, color, width, arrowSize }).filter(
        ([_key, value]) => value !== undefined,
      ),
    );

    return (run) => {
      // If we're trying to draw in the arrow, and the current opacity is 1,
      // make sure we show the line.
      if (drawn && !("opacity" in objectProps) && this.props.opacity === 0) {
        this.set({ opacity: 1 })(run);
      }

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

  draw(animationParams: anime.AnimeParams = {}): BuildFunction {
    return this.animate({ drawn: true }, animationParams);
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

      // If we have a doubled arrowhead, animate that as well.
      const doubledArrowAnimation = this.doubledArrowhead
        ? this.doubledArrowhead.animate(
            {
              points: shapes.doubledArrowhead,
              ...(arrowProps.color ? { fill: arrowProps.color } : {}),
            },
            animationParams,
          )
        : () => {};

      lineAnimation(run);
      arrowAnimation(run);
      doubledArrowAnimation(run);
    };
  }
}
