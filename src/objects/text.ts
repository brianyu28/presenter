import { ObjectProps, SlideObject } from "../presentation/object";

interface TextProps extends ObjectProps {
  content: string;
  fontStyle: string; // "normal" | "italic" | "bold"
  fontSize: number;
  fontFamily: string;
  color: string;
  dominantBaseline: string;
}

export class Text extends SlideObject<TextProps> {
  constructor(content: string, props: Partial<TextProps> = {}) {
    super({
      content,
      color: "#000000",
      fontSize: 150,
      fontStyle: "normal",
      fontFamily: "primary",
      dominantBaseline: "ideographic",
      ...props,
    });
  }

  tagName(): string {
    return "text";
  }

  attributes(): Partial<Record<string, string>> {
    const { color } = this.props;

    return {
      ...super.attributes(),
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
      x: x.toString(),
      y: (y + bbox.height).toString(),
      "dominant-baseline": this.props.dominantBaseline,
    };
  }

  styles(): Partial<Record<string, string>> {
    const { fontSize, fontFamily, fontStyle } = this.props;
    return {
      ...super.styles(),
      font: `${fontStyle} ${fontSize}px ${this.getFont(fontFamily)}`,
    };
  }

  children(): Array<Node> {
    return [document.createTextNode(this.props.content)];
  }

  requiresChildrenUpdate(props: Partial<TextProps>): boolean {
    return "content" in props && props.content !== this.props.content;
  }

  /**
   * If the font is defined in the theme, return the font name from the theme.
   * Otherwise, return the font name as is.
   */
  getFont(name: string) {
    const presentation = this._presentation;
    if (presentation && presentation.options.theme.text.fonts[name]) {
      return presentation.options.theme.text.fonts[name];
    }
    return name;
  }
}
