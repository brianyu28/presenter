import { ObjectProps, SlideObject } from "../presentation/object";
import { Animator, BuildFunction } from "../util/animation";
import { generateTextNodes, RichTextSpan } from "../util/richText";

export type TextContent = string | (string | RichTextSpan[])[];

export interface TextProps extends ObjectProps {
  content: TextContent;
  fontStyle: string; // "normal" | "italic" | "oblique"
  fontWeight: string | number; // "normal" | "bold" | number
  fontSize: number;
  fontFamily: string;
  color: string;
  dominantBaseline: string;
  textDecoration: string;

  // How many characters of content should be visible. `null` to show all
  // content.
  length: number | null;

  // Alignment and line spacing only matter for rich text.

  align: "left" | "center" | "right";
  lineSpacing: string;
  ligatures: string | null;
}

export class Text extends SlideObject<TextProps> {
  constructor(content: TextContent, props: Partial<TextProps> = {}) {
    super({
      content,
      color: "#000000",
      fontSize: 150,
      fontStyle: "normal",
      fontWeight: "normal",
      fontFamily: "Arial",
      dominantBaseline: "ideographic",
      textDecoration: "none",
      length: null,
      align: "left",
      lineSpacing: "1em",
      ligatures: null,
      ...props,
    });
  }

  isRichText(): boolean {
    return typeof this.props.content !== "string";
  }

  tagName(): string {
    return "text";
  }

  attributes(): Partial<Record<string, string>> {
    const { color, textDecoration } = this.props;

    return {
      ...super.attributes(),
      ...(textDecoration !== "none"
        ? { "text-decoration": textDecoration }
        : {}),
      fill: color,
    };
  }

  /**
   * Text elements return position as additional attributes since computing text
   * size and position requires other properties to be set first.
   */
  additionalAttributes(): Partial<Record<string, string>> {
    const bbox = this.computeRenderedBoundingBox(
      this.element() as SVGGraphicsElement,
      this.childrenWithContentLength(this.contentLength()),
    );
    let { x, y } = this.positionAttributes(bbox);

    // For rich text, we might need to adjust the x value for center-aligned or right-aligned text.
    // This is because the default translation by (x, y) assumes left-aligned text.
    if (this.isRichText()) {
      if (this.props.align === "center") {
        x += bbox.width / 2;
      } else if (this.props.align === "right") {
        x += bbox.width;
      }
    }

    return {
      ...super.additionalAttributes(),
      // Rich text needs a `translate` transformation instead of an `x` and `y` attributes.
      // This is because each line gets set with a `x` of 0 to align content.
      // Additionally, the text node as a whole is set with `y: 1em` to align the top-left
      // of the whole text content (0, 0).
      ...(this.isRichText()
        ? {
            transform: `translate(${x.toString()} ${y.toString()})`,
            y: "1em",
          }
        : {
            x: x.toString(),
            y: (y + bbox.height).toString(),
          }),
      "dominant-baseline": this.props.dominantBaseline,
    };
  }

  styles(): Partial<Record<string, string>> {
    const { fontSize, fontFamily, fontStyle, fontWeight, ligatures } =
      this.props;
    return {
      ...super.styles(),
      ...(fontStyle !== "normal" ? { "font-style": fontStyle } : {}),
      ...(fontWeight !== "normal"
        ? { "font-weight": fontWeight.toString() }
        : {}),
      ...(ligatures !== null ? { "font-variant-ligatures": ligatures } : {}),
      "font-size": `${fontSize}px`,
      "font-family": `"${fontFamily}"`,
      "white-space": "pre",
    };
  }

  children(): Node[] {
    const length = this.props.length ?? this.contentLength();
    return this.childrenWithContentLength(length);
  }

  requiresChildrenUpdate(props: Partial<TextProps>): boolean {
    return (
      ("content" in props && props.content !== this.props.content) ||
      ("length" in props && props.length !== this.props.length)
    );
  }

  /**
   * Returns the number of characters in the total text content.
   */
  contentLength(): number {
    if (typeof this.props.content === "string") {
      return this.props.content.length;
    }

    return this.props.content.reduce((acc, item) => {
      if (typeof item === "string") {
        return acc + item.length;
      }

      return (
        acc +
        item.reduce((acc, span) => {
          const text = typeof span === "string" ? span : span[0];
          return acc + text.length;
        }, 0)
      );
    }, 0);
  }

  /**
   * Returns the children of a text node, up to a particular content length.
   */
  childrenWithContentLength(length: number | null): Node[] {
    const { content } = this.props;

    // Text content can be a simple string or a list of possibly-formatted
    // lines. If it's a simple string, then return just the text node with
    // the trimmed content.
    if (typeof content === "string") {
      const trimmedContent =
        length === null ? content : content.slice(0, length);
      return [document.createTextNode(trimmedContent)];
    }

    // Content is multi-line or styled text.
    // We need to first determine its alignment.
    let textAnchor: "start" | "middle" | "end" =
      this.props.align === "left"
        ? "start"
        : this.props.align === "center"
          ? "middle"
          : "end";

    // If the length is `null`, we include all characters and don't need to do
    // any additional calculations.
    if (length === null) {
      return generateTextNodes(content, this.props.lineSpacing, textAnchor);
    }

    // If the content is a list of lines, then we need to re-create the list
    // of lines, but trimmed to only `length` characters.
    let remaining = length;
    const lines: (string | RichTextSpan[])[] = [];

    // Look at each line and determine whether it should be copied.
    for (const line of content) {
      // String lines can be copied directly.
      if (typeof line === "string") {
        if (line.length <= remaining) {
          lines.push(line);
          remaining -= line.length;
        } else {
          lines.push(line.slice(0, remaining));
          remaining = 0;
        }
      } else {
        // Otherwise, a line consists of a list of spans of possibly rich text.
        const spans: RichTextSpan[] = [];
        for (const span of line) {
          // Some spans are plain text and can be copied directly
          if (typeof span === "string") {
            if (span.length <= remaining) {
              spans.push(span);
              remaining -= span.length;
            } else {
              spans.push(span.slice(0, remaining));
              remaining = 0;
            }
          } else {
            // Otherwise, spans are rich text and we need to consider just the
            // length of the text component.
            if (span[0].length <= remaining) {
              spans.push(span);
              remaining -= span[0].length;
            } else {
              spans.push([span[0].slice(0, remaining), span[1]]);
              remaining = 0;
            }
          }

          if (remaining === 0) {
            break;
          }
        }
        lines.push(spans);
      }

      if (remaining === 0) {
        break;
      }
    }

    // Multiline styled text, render as tspan elements
    return generateTextNodes(lines, this.props.lineSpacing, textAnchor);
  }

  regenerateChildren() {
    this._children = this.children();
    this._element.innerHTML = "";
    for (const child of this._children) {
      this._element.appendChild(child);
    }
  }

  animate(
    props: Partial<TextProps>,
    animationParams: anime.AnimeParams = {},
    delay: number | null = null,
    animate: boolean = true,
  ): BuildFunction {
    // The length property needs to be animated separately as a write-on animation.
    const { length, ...textProps } = props;

    // If there is no length property, we can animate normally.
    if (length === undefined) {
      return super.animate(textProps, animationParams, delay, animate);
    }

    // Otherwise, we need to animate a write-on animation.
    return (run: Animator) => {
      this.writeOn(
        length,
        (animationParams.duration ?? 1000) as number,
        animate,
      )(run);

      // Animate the other properties if needed.
      if (Object.keys(textProps).length > 0) {
        super.animate(textProps, animationParams, delay, animate)(run);
      }
    };
  }

  /**
   * Returns a write-on animation for changing the characters.
   *
   * Writing on text requires a different approach than other text animations
   * since the children of the element need to be replaced.
   */
  writeOn(
    length: number | null = null,
    duration: number = 1000,
    animate: boolean = true,
  ): BuildFunction {
    let startLength: number | null = null;
    let endLength: number | null = null;
    let startTime: number | null = null;

    const animateCallback = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }
      if (startLength === null) {
        startLength = this.props.length ?? this.contentLength();
      }
      if (endLength === null) {
        endLength = length ?? this.contentLength();
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      this.props.length = Math.floor(
        startLength + (endLength - startLength) * progress,
      );
      this.regenerateChildren();

      if (progress < 1) {
        requestAnimationFrame(animateCallback);
      }
    };

    return (run) =>
      run({
        animate,
        animateCallback: () => {
          startTime = null;
          startLength = null;
          endLength = null;
          requestAnimationFrame(animateCallback);
        },
        updateCallback: () => {
          startTime = null;
          startLength = null;
          endLength = null;
          this.props.length = length;
          this.regenerateChildren();
        },
      });
  }
}
