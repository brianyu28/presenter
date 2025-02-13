import { TextContent } from "../objects/text";

export interface RichTextProps {
  fontStyle?: string; // "normal" | "italic" | "oblique"
  fontWeight?: string | number; // "normal" | "bold" | number
  fontSize?: string | number;
  fontFamily?: string;
  textDecoration?: string;
  color?: string;
  dy?: number;
  superscript?: boolean;
  subscript?: boolean;
}

export type RichTextSpan = string | [string, RichTextProps];

/**
 * Given a string, returns that string with leading spaces converted to &nbsp;
 */
function preserveStringLeadingSpaces(content: string): string {
  return content.replace(/^\s+/g, (match) => match.replace(/ /g, "\u00A0"));
}

export function preserveLeadingSpaces(content: TextContent): TextContent {
  if (typeof content === "string") {
    return preserveStringLeadingSpaces(content);
  }

  const lines = [];
  for (const originalLine of content) {
    if (typeof originalLine === "string") {
      lines.push(preserveStringLeadingSpaces(originalLine));
      continue;
    }

    // An empty line doesn't need modification.
    if (originalLine.length === 0) {
      lines.push(originalLine);
      continue;
    }

    // Otherwise, we just need to look at the first span to preserve its leading spaces.
    const spans = Array.from(originalLine);
    const firstSpan = spans[0];
    if (typeof firstSpan === "string") {
      spans[0] = preserveStringLeadingSpaces(firstSpan);
    } else {
      spans[0] = [preserveStringLeadingSpaces(firstSpan[0]), spans[0][1]] as [
        string,
        RichTextProps,
      ];
    }
    lines.push(spans);
  }

  return lines;
}

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

        const styles: Record<string, any> = {
          "font-family": props.fontFamily ? `"${props.fontFamily}"` : undefined,
          "font-size": props.fontSize,
          "font-weight": props.fontWeight,
          "font-style": props.fontStyle,
        };

        // Check for superscript or subscript
        if (props.superscript === true) {
          styles["baseline-shift"] = "super";
          if (styles["font-size"] === undefined) {
            styles["font-size"] = "50%";
          }
        } else if (props.subscript === true) {
          styles["baseline-shift"] = "sub";
          if (styles["font-size"] === undefined) {
            styles["font-size"] = "50%";
          }
        }

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
