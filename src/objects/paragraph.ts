import { ObjectProps, SlideObject } from "../presentation/object";

export interface ParagraphProps extends ObjectProps {
  content: string | string[];
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  color: string;
}

export class Paragraph extends SlideObject<ParagraphProps> {
  constructor(content: string | string[], props: Partial<ParagraphProps> = {}) {
    super({
      content,
      width: 1000,
      height: 1000,
      fontSize: 100,
      fontFamily: "Arial",
      color: "#000000",
      ...props,
    });
  }

  tagName(): string {
    return "foreignObject";
  }

  attributes(): Partial<Record<string, string>> {
    const { position, width, height } = this.props;
    return {
      ...super.attributes(),
      x: position.x.toString(),
      y: position.y.toString(),
      width: width.toString(),
      height: height.toString(),
    };
  }

  children(): Node[] {
    const { content } = this.props;
    const div = document.createElement("div");

    // Set div styling
    const styles = {
      "font-family": `"${this.props.fontFamily}"`,
      "font-size": `${this.props.fontSize}px`,
      color: this.props.color,
    };
    for (const [key, value] of Object.entries(styles)) {
      if (value !== undefined) {
        div.style.setProperty(key, value.toString());
      }
    }

    // Set div content
    if (typeof content === "string") {
      div.textContent = content;
    } else {
      for (const line of content) {
        const p = document.createElement("p");
        p.textContent = line;
        div.appendChild(p);
      }
    }
    return [div];
  }

  additionalAttributes(): Partial<Record<string, string>> {
    const bbox = this.computeRenderedBoundingBox(
      this.element() as SVGGraphicsElement,
      this._children,
    );
    const { x, y } = this.positionAttributes(bbox);

    return {
      ...super.additionalAttributes(),
      x: x.toString(),
      y: y.toString(),
    };
  }

  requiresChildrenUpdate(props: Partial<ParagraphProps>): boolean {
    return "content" in props && props.content !== this.props.content;
  }
}
