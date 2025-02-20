import { Group, GroupProps } from "../objects/group";
import { Rectangle, RectangleProps } from "../objects/rectangle";
import { Text, TextContent, TextProps } from "../objects/text";
import { Anchor } from "../presentation/object";
import { Presentation } from "../presentation/presentation";
import { Animator, BuildFunction } from "../util/animation";
import { Position } from "../util/position";
import { RichTextSpan } from "../util/richText";

/**
 * Region for syntax highlighting.
 *
 * The `presenter-syntax-highlight` script can be used to generate a list of
 * highlight regions for each line of code. This allows code to be
 * syntax-highlighted on the slide.
 */
export interface CodeHighlightRegion {
  // Start character index
  start: number;
  // End character index
  end: number;
  // Hex color code
  color: string;
  // Whether text should be bold
  bold: boolean;
}

export interface CodeBlockProps {
  code: string;
  highlights: CodeHighlightRegion[][] | null;

  // Number of visible characters of code
  length: number | null;

  fontFamily: string;
  fontSize: number;
  textColor: string;
  backgroundColor: string | null;
  backgroundRounding: number;
  padding: number;
  lineSpacing: string;

  // Monospace code sizing properties
  lineHeight: number;
  characterWidth: number;

  // Focus: emphasizes one area of the code
  focusColor: string;
  focusOpacity: number;
  focusRounding: number;

  // Specify line and column region to focus
  focusLineStart: number;
  focusLineEnd: number;
  focusColStart: number;
  focusColEnd: number;

  // Focus region can have additional padding and/or a slight pixel offset
  // from its computed value
  focusPaddingX: number;
  focusOffsetX: number;
  focusPaddingY: number;
  focusOffsetY: number;

  // Position of entire code block
  position: Position;
  anchor: Anchor;
}

export class CodeBlock extends Group {
  codeBlockProps: CodeBlockProps;
  background: Rectangle;
  focus: Rectangle;
  text: Text;

  constructor(props: Partial<CodeBlockProps> = {}) {
    const codeBlockProps: CodeBlockProps = {
      code: "",
      highlights: null,
      length: null,
      fontFamily: "Courier New",
      fontSize: 130,
      textColor: "#ffffff",
      backgroundColor: "#000000",
      backgroundRounding: 10,
      padding: 50,
      lineSpacing: "1em",
      lineHeight: props.fontSize ?? 130,
      characterWidth: 80,
      focusColor: "#4166a5",
      focusOpacity: 0,
      focusRounding: 10,
      focusLineStart: 1,
      focusLineEnd: 1,
      focusColStart: 1,
      focusColEnd: 1,
      focusPaddingX: 0,
      focusPaddingY: 0,
      focusOffsetX: 0,
      focusOffsetY: 0,
      position: { x: 0, y: 0 },
      anchor: "topleft",
      ...props,
    };
    const {
      group: groupProps,
      background: backgroundProps,
      focus: focusProps,
      text: { content, ...textProps },
    } = CodeBlock.getComponentProps(codeBlockProps);

    const background = new Rectangle(backgroundProps);
    const focus = new Rectangle(focusProps);
    const text = new Text(content, textProps);
    super([background, focus, text], groupProps);

    this.codeBlockProps = codeBlockProps;
    this.background = background;
    this.focus = focus;
    this.text = text;
  }

  /**
   * Animation of code block. Since a code block is made up of multiple
   * elements (background, focus, text), we animate each element separately.
   */
  animate(
    props: Partial<CodeBlockProps>,
    animationParams: anime.AnimeParams = {},
    delay: number | null = null,
    animate: boolean = true,
  ): BuildFunction {
    return (run: Animator) => {
      this.codeBlockProps = { ...this.codeBlockProps, ...props };
      const {
        group: groupProps,
        background: backgroundProps,
        focus: focusProps,
        text: { content, ...textProps },
      } = CodeBlock.getComponentProps(this.codeBlockProps);
      super.animate(groupProps, animationParams, delay, animate)(run);
      this.background.animate(
        backgroundProps,
        animationParams,
        delay,
        animate,
      )(run);
      this.focus.animate(focusProps, animationParams, delay, animate)(run);
      this.text.animate(
        { content, ...textProps },
        animationParams,
        delay,
        animate,
      )(run);
    };
  }

  /**
   * Given properties for the entire code block, compute properties for individual text elements.
   */
  static getComponentProps(props: CodeBlockProps): {
    group: Partial<GroupProps>;
    background: Partial<RectangleProps>;
    focus: Partial<RectangleProps>;
    text: Partial<TextProps>;
  } {
    const {
      padding,
      characterWidth,
      lineHeight,
      focusLineStart,
      focusLineEnd,
      focusColStart,
      focusColEnd,
      focusOffsetX,
      focusOffsetY,
      focusPaddingX,
      focusPaddingY,
    } = props;
    const code = props.code.trimEnd();
    const maxLineLength = code
      .split("\n")
      .reduce((max, line) => Math.max(max, line.length), 0);
    const codeContent = CodeBlock.buildTextContent(code, props.highlights);

    return {
      group: {
        position: props.position,
        anchor: props.anchor,
      },
      background: {
        width: characterWidth * maxLineLength + 2 * padding,
        height: lineHeight * codeContent.length + 2 * padding,
        rounding: props.backgroundRounding,
        fill:
          props.backgroundColor === null
            ? "transparent"
            : props.backgroundColor,
        position: { x: 0, y: 0 },
        anchor: "topleft",
      },
      focus: {
        width:
          characterWidth * (focusColEnd - focusColStart + 1) +
          focusPaddingX * 2,
        height:
          lineHeight * (focusLineEnd - focusLineStart + 1) + focusPaddingY * 2,
        rounding: props.focusRounding,
        fill: props.focusColor,
        opacity: props.focusOpacity,
        position: {
          x:
            padding +
            (focusColStart - 1) * characterWidth -
            focusPaddingX +
            focusOffsetX,
          y:
            padding +
            (focusLineStart - 1) * lineHeight -
            focusPaddingY +
            focusOffsetY,
        },
        anchor: "topleft",
      },
      text: {
        content: codeContent,
        length: props.length,
        fontFamily: props.fontFamily,
        fontSize: props.fontSize,
        lineSpacing: props.lineSpacing,
        color: props.textColor,
        position: { x: padding, y: padding },
        anchor: "topleft",
      },
    };
  }

  static buildTextContent(
    code: string,
    highlights: CodeHighlightRegion[][] | null,
  ): TextContent {
    // If there are no highlights, return each line as plain text
    if (highlights === null) {
      return code.split("\n").map((line) => {
        return line;
      });
    }

    // Otherwise, build each line with highlights
    const lines = code.split("\n");
    const textContentLines: TextContent = [];

    for (const highlightLine of highlights) {
      const line: RichTextSpan[] = [];

      for (const highlight of highlightLine) {
        line.push([
          lines[textContentLines.length].substring(
            highlight.start - 1,
            highlight.end,
          ),
          {
            color: highlight.color,
            fontWeight: highlight.bold ? "bold" : "normal",
          },
        ]);
      }

      textContentLines.push(line);
    }

    return textContentLines;
  }

  /**
   * Given text properties, calculates the character width and line height for the font at that size.
   * Can be pre-computed, then be used as input to a new CodeBlock.
   *
   * Sample usage in a presentation to determine text properties:
   *
   * console.log(CodeBlock.computePropsForText(presentation, {
   *   fontFamily: "Menlo",
   *   fontSize: 130,
   * }));
   */
  static computePropsForText(
    presentation: Presentation,
    textProps: Partial<TextProps>,
  ) {
    // To calculate line height and character width, we render different amounts of text and measure sizes.
    // Start and end sizes are mostly arbitrary.
    const startSize = 10;
    const endSize = 50;
    const char = "H";

    const startText = new Text(
      Array(startSize).fill(char.repeat(startSize)),
      textProps,
    );
    startText.generate(presentation);
    const endText = new Text(
      Array(endSize).fill(char.repeat(endSize)),
      textProps,
    );
    endText.generate(presentation);

    const startBBox = startText.computeRenderedBoundingBox(
      startText.element() as SVGGraphicsElement,
    );
    const endBBox = endText.computeRenderedBoundingBox(
      endText.element() as SVGGraphicsElement,
    );

    const lineHeight =
      (endBBox.height - startBBox.height) / (endSize - startSize);
    const characterWidth =
      (endBBox.width - startBBox.width) / (endSize - startSize);

    return { lineHeight, characterWidth };
  }
}
