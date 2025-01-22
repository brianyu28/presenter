import { ObjectProps, SlideObject } from "../presentation/object";
import { BoundingBox } from "../util/position";

export interface IFrameProps extends ObjectProps {
  url: string;
  width: number;
  height: number;
  backgroundColor: string;

  // Scale of iframe content
  scale: number;
}

export class IFrame extends SlideObject<IFrameProps> {
  constructor(props: Partial<IFrameProps> = {}) {
    super({
      url: "https://wikipedia.org/",
      width: 2500,
      height: 1500,
      scale: 3,
      backgroundColor: "#ffffff",
      ...props,
    });
  }

  tagName(): string {
    return "foreignObject";
  }

  attributes(): Partial<Record<string, string>> {
    const { position, width, height } = this.props;
    const { x, y } = this.positionAttributes(
      new BoundingBox(position, width, height),
    );
    return {
      ...super.attributes(),
      x: x.toString(),
      y: y.toString(),
      width: width.toString(),
      height: height.toString(),
    };
  }

  styles(): Partial<Record<string, string>> {
    return {
      ...super.styles(),
      "background-color": this.props.backgroundColor,
      ...(this.props.opacity === 0 ? { "pointer-events": "none" } : {}),
    };
  }

  children(): Node[] {
    const iframe = document.createElement("iframe");
    iframe.src = this.props.url;

    const size = (100 / this.props.scale).toFixed(2) + "%";
    iframe.style.width = size;
    iframe.style.height = size;
    iframe.style.transform = `scale(${this.props.scale})`;
    iframe.style.transformOrigin = "top left";
    return [iframe];
  }
}
