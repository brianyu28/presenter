import { Group, GroupProps } from "../objects/group";
import { Mask } from "../objects/mask";
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

  // If non-null, `lineCount` is the number of lines to show at a time.
  // Lines can be masked so that only some are visible in the region at a time.
  lineCount: number | null;
  colCount: number | null;
  maskLines: boolean;
  firstLine: number;
  unfocusedOpacity: number;

  // Whether to show line numbers
  lineNumbers: boolean;
  firstLineNumber: number;
  lineNumberColor: string;

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
  initialCodeBlockProps: CodeBlockProps;
  codeBlockProps: CodeBlockProps;

  background: Rectangle;
  maskRect: Rectangle | null;
  maskFocusRect: Rectangle | null;

  // Code content group contains text and focus highlight
  codeContentGroup: Group;
  focus: Rectangle;
  text: Text;
  lineNumbers: Text | null;

  constructor(props: Partial<CodeBlockProps> = {}) {
    // If not specified whether to mask lines, decide based on whether
    // we've specified a line count to show.
    const maskLines =
      props.maskLines === undefined
        ? "lineCount" in props && props.lineCount !== null
        : props.maskLines;

    const codeBlockProps: CodeBlockProps = {
      code: "",
      highlights: null,
      length: null,
      fontFamily: "Courier New",
      fontSize: 130,
      textColor: "#ffffff",
      backgroundColor: "#000000",
      backgroundRounding: 10,
      padding: 15,
      lineSpacing: "1em",
      lineHeight: props.fontSize ?? 130,
      characterWidth: 80,
      lineCount: null,
      colCount: null,
      maskLines,
      firstLine: 1,
      unfocusedOpacity: 1,
      lineNumbers: false,
      firstLineNumber: 1,
      lineNumberColor: "#d0d0d0",
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
    super([], {
      positioned: true,
    });
    this.codeBlockProps = codeBlockProps;
    this.initialCodeBlockProps = codeBlockProps;
  }

  createElement(): SVGElement {
    this.codeBlockProps = { ...this.initialCodeBlockProps };
    const {
      group: groupProps,
      background: backgroundProps,
      mask: maskProps,
      maskFocus: maskFocusProps,
      focus: focusProps,
      text: { content, ...textProps },
      lineNumbers: lineNumbersProps,
    } = CodeBlock.getComponentProps(this.codeBlockProps);

    const background = new Rectangle(backgroundProps);

    let mask = null;
    let maskRect = null;
    let maskFocusRect = null;
    if (this.codeBlockProps.maskLines) {
      maskRect = new Rectangle(maskProps);
      maskFocusRect = new Rectangle(maskFocusProps);
      mask = new Mask([maskRect, maskFocusRect]);
    }

    const focus = new Rectangle(focusProps);
    const text = new Text(content, textProps);

    let lineNumbers = null;
    if (lineNumbersProps !== null) {
      const { content: lineNumbersContent, ...remainingLineNumbersProps } =
        lineNumbersProps;
      lineNumbers = new Text(lineNumbersContent, remainingLineNumbersProps);
    }

    const codeContentGroup = new Group(
      [focus, text, ...(lineNumbers !== null ? [lineNumbers] : [])],
      {
        ...(mask !== null ? { mask: mask.id } : {}),
      },
    );

    this.props.objects = [
      ...(mask !== null ? [mask] : []),
      background,
      codeContentGroup,
    ];
    this.props = {
      ...this.props,
      ...groupProps,
    };

    this.background = background;
    this.maskRect = maskRect;
    this.maskFocusRect = maskFocusRect;
    this.focus = focus;
    this.text = text;
    this.lineNumbers = lineNumbers;
    return super.createElement();
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
        mask: maskProps,
        maskFocus: maskFocusProps,
        focus: focusProps,
        text: { content, ...textProps },
        lineNumbers: lineNumbersProps,
      } = CodeBlock.getComponentProps(this.codeBlockProps);
      super.animate(groupProps, animationParams, delay, animate)(run);
      this.background.animate(
        backgroundProps,
        animationParams,
        delay,
        animate,
      )(run);
      this.focus.animate(focusProps, animationParams, delay, animate)(run);

      // Hnadle mask animations
      if (this.maskRect !== null) {
        this.maskRect.animate(maskProps, animationParams, delay, animate)(run);
        this.maskFocusRect.animate(
          maskFocusProps,
          animationParams,
          delay,
          animate,
        )(run);
      }

      // Handle code and line number animations
      this.text.animate(
        { content, ...textProps },
        animationParams,
        delay,
        animate,
      )(run);
      if (lineNumbersProps !== null) {
        this.lineNumbers.animate(
          lineNumbersProps,
          animationParams,
          delay,
          animate,
        )(run);
      }
    };
  }

  set(
    props: Partial<CodeBlockProps>,
    delay: number | null = null,
  ): BuildFunction {
    return this.animate(props, {}, delay, false);
  }

  /**
   * Given properties for the entire code block, compute properties for individual text elements.
   */
  static getComponentProps(props: CodeBlockProps): {
    group: Partial<GroupProps>;
    background: Partial<RectangleProps>;
    mask: Partial<RectangleProps>;
    maskFocus: Partial<RectangleProps>;
    focus: Partial<RectangleProps>;
    text: Partial<TextProps>;
    lineNumbers: Partial<TextProps> | null;
  } {
    const {
      padding,
      characterWidth,
      lineHeight,
      firstLine,
      unfocusedOpacity,
      lineNumbers,
      firstLineNumber,
      lineNumberColor,
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
    const colCount = props.colCount ?? maxLineLength;
    const codeContent = CodeBlock.buildTextContent(code, props.highlights);
    const lineCount = props.lineCount ?? codeContent.length;

    let lineNumbersProps: Partial<TextProps> | null = null;

    const lineNumberLength = codeContent.length.toString().length + 3;
    if (lineNumbers) {
      const lineNumbersContent = Array.from(
        { length: codeContent.length },
        (_, i) => firstLineNumber + i,
      ).map((lineNumber) => {
        return `${lineNumber}  `.padStart(lineNumberLength, " ");
      });

      lineNumbersProps = {
        content: lineNumbersContent,
        fontFamily: props.fontFamily,
        fontSize: props.fontSize,
        lineSpacing: props.lineSpacing,
        color: lineNumberColor,
        position: { x: padding, y: padding - (firstLine - 1) * lineHeight },
        anchor: "topleft",
      };
    }
    const lineNumberPadding = lineNumbers
      ? lineNumberLength * characterWidth
      : 0;

    const backgroundProps: Partial<RectangleProps> = {
      width: characterWidth * colCount + 2 * padding + lineNumberPadding,
      height: lineHeight * lineCount + 2 * padding,
      rounding: props.backgroundRounding,
      fill:
        props.backgroundColor === null ? "transparent" : props.backgroundColor,
      position: { x: 0, y: 0 },
      anchor: "topleft",
    };

    const focusProps: Partial<RectangleProps> = {
      width:
        characterWidth * (focusColEnd - focusColStart + 1) + focusPaddingX * 2,
      height:
        lineHeight * (focusLineEnd - focusLineStart + 1) + focusPaddingY * 2,
      rounding: props.focusRounding,
      fill: props.focusColor,
      opacity: props.focusOpacity,
      position: {
        x:
          padding +
          lineNumberPadding +
          (focusColStart - 1) * characterWidth -
          focusPaddingX +
          focusOffsetX,
        y:
          padding -
          (firstLine - 1) * lineHeight +
          (focusLineStart - 1) * lineHeight -
          focusPaddingY +
          focusOffsetY,
      },
      anchor: "topleft",
    };

    return {
      group: {
        position: props.position,
        anchor: props.anchor,
      },
      background: {
        ...backgroundProps,
      },
      mask: {
        ...backgroundProps,
        fill: `rgb(255, 255, 255, ${unfocusedOpacity})`,
      },
      focus: {
        ...focusProps,
      },
      maskFocus: {
        ...focusProps,
        fill: "white",
      },
      text: {
        content: codeContent,
        length: props.length,
        fontFamily: props.fontFamily,
        fontSize: props.fontSize,
        lineSpacing: props.lineSpacing,
        color: props.textColor,
        position: {
          x: padding + lineNumberPadding,
          y: padding - (firstLine - 1) * lineHeight,
        },
        anchor: "topleft",
      },
      lineNumbers: lineNumbersProps,
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
   * When code block is masked, we don't want to include the full text in
   * the bounding box calculation. Instead, we want to use just visible
   * background rectangle.
   */
  sizingElement(): SVGGraphicsElement {
    // When not masked, use the default behavior.
    if (!this.codeBlockProps.maskLines) {
      return super.sizingElement();
    }

    const g = this.element().cloneNode();
    g.appendChild(this.background.element().cloneNode());
    return g as SVGGraphicsElement;
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
