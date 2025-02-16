import { ObjectProps, SlideObject } from "../presentation/object";
import { Animator, BuildFunction } from "../util/animation";
import { BoundingBox } from "../util/position";

export interface RectangleProps extends ObjectProps {
  fill: string;
  width: number;
  height: number;
  rounding: number;
  borderWidth: number;
  borderColor: string;
  drawn: boolean;
}

interface PathDrawOnProps {
  drawDuration: number;
  fillDuration: number;
  easing: string;
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
      drawn: true,
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
      drawn,
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
      ...(!drawn
        ? {
            stroke: "none",
            fill: "none",
          }
        : {}),
    };
  }

  animate(
    props: Partial<RectangleProps>,
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
      element.setAttribute("stroke-dashoffset", `${pathLength}`);
      element.setAttribute("stroke-dasharray", `${pathLength}`);
      element.setAttribute("stroke", borderColor);

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
