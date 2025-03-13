import { ObjectProps, SlideObject } from "../presentation/object";
import { BoundingBox } from "../util/position";

export interface ImageProps extends ObjectProps {
  href: string;
  width: number;
  height: number;
  rounding: number;
  rendering: "crisp-edges" | "pixelated" | null;
}

export class Image extends SlideObject<ImageProps> {
  constructor(href: string, props: Partial<ImageProps> = {}) {
    Image.prefetch(href);
    super({
      href,
      width: 100,
      height: 100,
      rounding: 0,
      rendering: null,
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
    const { rendering, rounding } = this.props;
    return {
      ...super.styles(),
      ...(rounding !== 0
        ? {
            "clip-path": `inset(0px round ${rounding}px)`,
          }
        : {}),
      ...(rendering !== null
        ? {
            "image-rendering": rendering,
          }
        : {}),
    };
  }

  /**
   * By default, browsers might not fetch an image until the image element is
   * added to the DOM. Pre-fetching them when the image object is created
   * means the image will be fetched before the slide is rendered, so there's
   * no delay between the slide appearing and the image loading.
   */
  static prefetch(href: string): void {
    const runPrefetch = () => {
      const element = document.createElement("img");
      element.src = href;
      element.style.display = "none";

      document.body.appendChild(element);
      element.addEventListener("load", () => {
        element.remove();
      });
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", runPrefetch);
    } else {
      runPrefetch();
    }
  }
}
