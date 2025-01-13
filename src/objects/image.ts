import { ObjectProps, SlideObject } from "../presentation/object";
import { BoundingBox } from "../util/position";

export interface ImageProps extends ObjectProps {
  href: string;
  width: number;
  height: number;
  rounding: number;
}

export class Image extends SlideObject<ImageProps> {
  constructor(href: string, props: Partial<ImageProps> = {}) {
    super({
      href,
      width: 100,
      height: 100,
      rounding: 0,
      ...props,
    });
  }

  tagName(): string {
    return "image";
  }

  attributes(): Partial<Record<string, string>> {
    const { position, href, width, height } = this.props;
    const { x, y } = this.positionAttributes(
      new BoundingBox(position, width, height),
    );

    return {
      ...super.attributes(),
      href,
      width: width.toString(),
      height: height.toString(),
      x: x.toString(),
      y: y.toString(),
    };
  }

  styles(): Partial<Record<string, string>> {
    const { rounding } = this.props;
    return {
      ...super.styles(),
      ...(rounding !== 0
        ? {
            "clip-path": `inset(0px round ${rounding}px)`,
          }
        : {}),
    };
  }
}
