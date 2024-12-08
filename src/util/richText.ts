export interface RichTextProps {
  fontStyle?: string; // "normal" | "italic" | "oblique"
  fontWeight?: string | number; // "normal" | "bold" | number
  fontSize?: number;
  fontFamily?: string;
  color?: string;
}

export type RichTextSpan = string | [string, RichTextProps];

/**
 * Given rich text configuration, returns the corresponding tspan nodes.
 */
export function generateTextNodes(
  lines: RichTextSpan[][],
  anchor: "start" | "middle" | "end" = "start",
): Node[] {
  const nodes: Node[] = [];
  let lineNumber = 0;
  for (const line of lines) {
    lineNumber++;

    const lineSpan = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "tspan",
    );
    lineSpan.setAttribute("x", "0");
    lineSpan.setAttribute("text-anchor", anchor);
    if (lineNumber > 1) {
      lineSpan.setAttribute("dy", "1em");
    }

    for (const span of line) {
      if (typeof span === "string") {
        lineSpan.appendChild(document.createTextNode(span));
      } else {
        const [text, props] = span;
        const node = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "tspan",
        );
        node.textContent = text;

        const attributes = {
          fill: props.color,
        };

        for (const [key, value] of Object.entries(attributes)) {
          if (value !== undefined) {
            node.setAttribute(key, value.toString());
          }
        }

        const styles = {
          "font-family": props.fontFamily,
          "font-size": props.fontSize,
          "font-weight": props.fontWeight,
          "font-style": props.fontStyle,
        };

        for (const [key, value] of Object.entries(styles)) {
          if (value !== undefined) {
            node.style.setProperty(key, value.toString());
          }
        }

        lineSpan.appendChild(node);
      }
    }
    nodes.push(lineSpan);
  }
  return nodes;
}
