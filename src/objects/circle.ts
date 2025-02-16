import { ObjectProps, SlideObject } from "../presentation/object";
import { Animator, BuildFunction } from "../util/animation";
import { BoundingBox } from "../util/position";

export interface CircleProps extends ObjectProps {
  fill: string;
  radius: number;
  borderWidth: number;
  borderColor: string;
  drawn: boolean;
}

interface PathDrawOnProps {
  drawDuration: number;
  fillDuration: number;
  easing: string;
}

export class Circle extends SlideObject<CircleProps> {
  constructor(props: Partial<CircleProps> = {}) {
    super({
      fill: "#000000",
      radius: 100,
      borderWidth: 0,
      borderColor: "#000000",
      drawn: true,
      ...props,
    });
  }

  tagName(): string {
    return "circle";
  }

  attributes(): Partial<Record<string, string>> {
    const { drawn, position, radius, fill, borderWidth, borderColor } =
      this.props;
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
      ...(!drawn
        ? {
            stroke: "none",
            fill: "none",
          }
        : {}),
    };
  }

  animate(
    props: Partial<CircleProps>,
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

  drawOn(props: Partial<PathDrawOnProps> = {}): BuildFunction {
    return (run) => {
      const { borderColor, borderWidth, fill } = this.props;
      this.props.drawn = true;
      const element = this.element() as SVGPathElement;
      let pathLength;
      try {
        pathLength = element.getTotalLength();
      } catch (e) {
        // If we're calling this as a skip animation, element might not
        // be rendered yet. In that case, just set pathLength to 0.
        pathLength = 0;
      }
      const drawDuration = props.drawDuration ?? 1000;

      // Set initial path attributes for drawing stroke.
      element.setAttribute("stroke-dashoffset", `${pathLength * 0.25}`);
      element.setAttribute("stroke-dasharray", `0, ${pathLength}`);
      element.setAttribute("stroke", borderColor);

      run({
        animate: true,
        element,
        attributes: {
          "stroke-dasharray": `${pathLength}, 0`,
        },
        animationParams: {
          duration: drawDuration,
          easing: props.easing ?? "linear",
        },
        updateCallback: () => {
          if (borderWidth > 0) {
            element.setAttribute("stroke", borderColor);
          }
          element.setAttribute("fill", fill);
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
          "stroke-dashoffset": "none",
          "stroke-dasharray": "none",
        },
        animationParams: {
          duration: props.fillDuration ?? 500,
          easing: "linear",
        },
      });
    };
  }
}
