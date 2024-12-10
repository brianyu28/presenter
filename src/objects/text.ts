import { ObjectProps, SlideObject } from "../presentation/object";
import {
  createSpacePreservingTextNode,
  generateTextNodes,
  RichTextSpan,
} from "../util/richText";

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

  // Alignment and line spacing only matter for rich text.

  align: "left" | "center" | "right";
  lineSpacing: string;
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
      align: "left",
      lineSpacing: "1em",
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
      this._children,
    );
    const { x, y } = this.positionAttributes(bbox);

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
    const { fontSize, fontFamily, fontStyle, fontWeight } = this.props;
    return {
      ...super.styles(),
      ...(fontStyle !== "normal" ? { "font-style": fontStyle } : {}),
      ...(fontWeight !== "normal"
        ? { "font-weight": fontWeight.toString() }
        : {}),
      "font-size": `${fontSize}px`,
      "font-family": `"${fontFamily}"`,
    };
  }

  children(): Node[] {
    const { content } = this.props;

    // Not rich text, render as a single text node
    if (typeof content === "string") {
      return [createSpacePreservingTextNode(content)];
    }

    // Multiline styled text, render as tspan elements
    let textAnchor: "start" | "middle" | "end" =
      this.props.align === "left"
        ? "start"
        : this.props.align === "center"
          ? "middle"
          : "end";
    return generateTextNodes(content, this.props.lineSpacing, textAnchor);
  }

  requiresChildrenUpdate(props: Partial<TextProps>): boolean {
    return "content" in props && props.content !== this.props.content;
  }
}
