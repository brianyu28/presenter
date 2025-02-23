import { ObjectProps, SlideObject } from "../presentation/object";
import { Animator, BuildFunction } from "../util/animation";
import { Position } from "../util/position";

export interface LineProps extends ObjectProps {
  start: Position;
  end: Position;
  color: string;
  width: number;
  linecap: "butt" | "round" | "square" | null;

  /**
   * Property describing whether the line has been fully drawn.
   * If a line hasn't been drawn, it can be animated to draw in.
   */
  drawn: boolean;
}

export class Line extends SlideObject<LineProps> {
  constructor(props: Partial<LineProps> = {}) {
    super({
      start: { x: 0, y: 0 },
      end: { x: 100, y: 100 },
      color: "#000000",
      width: 10,
      linecap: null,
      drawn: true,
      ...props,
    });
  }

  tagName(): string {
    return "line";
  }

  attributes(): Partial<Record<string, string>> {
    const { color, drawn, width, linecap } = this.props;
    const start = this.positionInPresentation(this.props.start);
    const end = this.positionInPresentation(this.props.end);

    const x1 = start.x.toString();
    const y1 = start.y.toString();
    let x2 = end.x.toString();
    let y2 = end.y.toString();

    // If a line hasn't been drawn yet, its end point is the same as its start point.
    if (!drawn) {
      x2 = x1;
      y2 = y1;
    }

    return {
      ...super.attributes(),
      x1,
      y1,
      x2,
      y2,
      stroke: color,
      "stroke-width": width.toString(),
      ...(linecap !== null && drawn ? { "stroke-linecap": linecap } : {}),
    };
  }

  animate(
    props: Partial<LineProps>,
    animationParams: anime.AnimeParams = {},
    delay: number | null = null,
    animate: boolean = true,
  ): BuildFunction {
    return (run: Animator) => {
      const { drawn, linecap } = { ...this.props, ...props };

      if (drawn && linecap !== null) {
        // Anime.js can't animate the linecap, so we need to set it manually.
        this.element().setAttribute("stroke-linecap", linecap);
      } else if (!drawn) {
        // Non-drawn lines need to have linecap set to "butt",
        // otherwise their 0-length lines will be visible.
        this.element().setAttribute("stroke-linecap", "butt");
      }

      super.animate(props, animationParams, delay, animate)(run);
    };
  }
}
