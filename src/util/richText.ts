export interface RichTextProps {
  fontStyle?: string; // "normal" | "italic" | "oblique"
  fontWeight?: string | number; // "normal" | "bold" | number
  fontSize?: number;
  fontFamily?: string;
  textDecoration?: string;
  color?: string;
  dy?: number;
}

export type RichTextSpan = string | [string, RichTextProps];

/**
 * Given rich text configuration, returns the corresponding tspan nodes.
 */
export function generateTextNodes(
  lines: (string | RichTextSpan[])[],
  lineSpacing: string = "1em",
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
      lineSpan.setAttribute("dy", lineSpacing);
    }

    // If it's a blank line, we should at least add a space to keep the line height.
    if (line.length === 0 || (line.length === 1 && line[0] === "")) {
      lineSpan.appendChild(document.createTextNode(" "));
      nodes.push(lineSpan);
      continue;
    }

    // If the line is just a string, just use a single text node in the line.
    if (typeof line === "string") {
      lineSpan.appendChild(document.createTextNode(line));
      nodes.push(lineSpan);
      continue;
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
          dy: props.dy,
          "text-decoration": props.textDecoration,
        };

        for (const [key, value] of Object.entries(attributes)) {
          if (value !== undefined) {
            node.setAttribute(key, value.toString());
          }
        }

        const styles = {
          "font-family": props.fontFamily ? `"${props.fontFamily}"` : undefined,
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
