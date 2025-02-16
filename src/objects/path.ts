import { ObjectProps, SlideObject } from "../presentation/object";
import { Animator, BuildFunction } from "../util/animation";
import { Position } from "../util/position";

export interface PathProps extends ObjectProps {
  points: Position[];
  color: string;
  fill: string;
  width: number;
  linecap: "butt" | "round" | "square" | null;
  drawn: boolean;
}

interface PathDrawOnProps {
  drawDuration: number;
  fillDuration: number;
  easing: string;
}

export class Path extends SlideObject<PathProps> {
  constructor(props: Partial<PathProps> = {}) {
    super({
      points: [],
      color: "#000000",
      fill: "none",
      width: 10,
      linecap: null,
      drawn: true,
      ...props,
    });
  }

  tagName(): string {
    return "path";
  }

  attributes(): Partial<Record<string, string>> {
    const { color, drawn, fill, width, linecap } = this.props;
    const points = this.props.points.map((point) =>
      this.positionInPresentation(point),
    );

    const d = points
      .map((point, i) => {
        const prefix = i === 0 ? "M" : "L";
        const x = point.x;
        const y = point.y;
        return `${prefix} ${x} ${y}`;
      })
      .join(" ");

    return {
      ...super.attributes(),
      d,
      fill: drawn ? fill : "none",
      stroke: color,
      "stroke-width": drawn ? width.toString() : "0",
      ...(linecap !== null ? { "stroke-linecap": linecap } : {}),
    };
  }

  animate(
    props: Partial<PathProps>,
    animationParams: anime.AnimeParams & { fillDuration?: number } = {},
    delay: number | null = null,
    animate: boolean = true,
  ): BuildFunction {
    const { drawn, ...rest } = props;

    // If no change in drawn status, animate normally.
    if (drawn === undefined) {
      return super.animate(rest, animationParams, delay, animate);
    }

    // Otherwise, we need to animate a drawing.
    return (run: Animator) => {
      this.drawOn({
        drawDuration: (animationParams.duration ?? 1000) as number,
        fillDuration: (animationParams.fillDuration ?? 300) as number,
        easing: (animationParams.easing ?? "linear") as string,
      })(run);

      // Animate other properties if needed
      if (Object.keys(rest).length > 0) {
        super.animate(rest, animationParams, delay, animate)(run);
      }
    };
  }

  /**
   * Animates drawing of SVG path.
   */
  drawOn(props: Partial<PathDrawOnProps> = {}): BuildFunction {
    return (run) => {
      this.props.drawn = true;
      const element = this.element() as SVGPathElement;
      const pathLength = element.getTotalLength();
      const drawDuration = props.drawDuration ?? 1000;

      // Set initial path attributes for drawing stroke.
      element.setAttribute("stroke-dashoffset", `${pathLength}`);
      element.setAttribute("stroke-dasharray", `${pathLength}`);
      element.setAttribute("stroke-width", `${this.props.width}`);

      run({
        animate: true,
        element,
        attributes: {
          "stroke-dashoffset": "0",
        },
        animationParams: {
          duration: drawDuration,
          easing: props.easing ?? "linear",
        },
      });

      // If we're not proceeding with fill, return early.
      if (this.props.fill === "none") {
        return;
      }

      run({
        animate: true,
        delay: drawDuration,
        element,
        attributes: {
          fill: this.props.fill,
          "stroke-dasharray": "none",
        },
        animationParams: {
          duration: props.fillDuration ?? 1000,
          easing: props.easing ?? "linear",
        },
      });
    };
  }
}
