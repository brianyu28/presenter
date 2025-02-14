import { BoundingBox } from "../util/position";
import { Slide } from "./slide";
import { restorePresentationState, storePresentationState } from "./storage";

/*
 * Normally, presentations run with browser fonts.
 * However, when exporting to PDF, we need to embed the fonts.
 * `PresentationFont` encodes the needed information to embed fonts.
 *
 * Only TTF fonts are supported due to a limitation in jsPDF.
 */
export interface PresentationFont {
  url: string;
  fontFamily: string;
  fontStyle?: string;
  fontWeight?: string | number;
}

export interface PresentationOptions {
  /**
   * Width of the presentation.
   */
  width: number;

  /**
   * Height of the presentation.
   */
  height: number;

  /**
   * Slide color for the presentation.
   */
  backgroundColor: string;

  /**
   * Fonts to embed in PDF export.
   */
  fonts: PresentationFont[];

  /**
   * How long cached presentation state should be valid for, in minutes.
   * `null` menas don't use cached data at all.
   * `0` means use cached data indefinitely.
   *
   * When presentation state is cached, reloading the presentation returns
   * the user to the slide and build they were on previously.
   */
  stateCacheTTL: number | null;
}

interface PresentationState {
  currentSlide: number;
}

export class Presentation {
  /**
   * Title of the presentation.
   */
  title: string;

  /**
   * Element where presentation should be mounted.
   */
  element: HTMLElement;

  /**
   * SVG container element.
   */
  container: HTMLElement;

  /**
   * Parent SVG element of presentation.
   */
  svg: SVGSVGElement | null;

  /**
   * Shadow SVG element, not displayed and used for calculating sizes.
   */
  shadow: SVGSVGElement | null;

  /**
   * Background SVG element, used for rendering background color.
   */
  background: SVGSVGElement | null;

  /**
   * Additional element container for elements that aren't part of the SVG.
   */
  additionalElementContainer: HTMLElement | null;

  /**
   * Element that allows navigation between different slides.
   */
  navigatorContainer: HTMLElement | null;

  /**
   * Presentation settings.
   */
  options: PresentationOptions;

  /**
   * Bounds of presentation.
   */
  boundingBox: BoundingBox;

  /**
   * Presentation slides.
   */
  slides: Slide[];

  /**
   * Presentation state.
   */
  presentationState: PresentationState;

  /**
   * Keyboard shortcut access to jump to particular slides.
   * A null slide index indicates not changing the slide
   * (i.e. keeping the same slide active.)
   */
  shortcuts: Record<
    string,
    { slideIndex: number | null; animationIndex: number }
  >;

  /**
   * Current text command that the presenter has entered into presentation.
   */
  textCommand: { active: boolean; command: string };

  /*
   * Functions that should be called before switching to a new slide.
   */
  slideCleanupHandlers: (() => void)[];

  /**
   *
   * @param title Title of the presentation.
   */
  constructor(
    title: string,
    slides: Slide[],
    element: HTMLElement,
    options: Partial<PresentationOptions> = {},
  ) {
    if (this.element === null) {
      throw new Error("Presentation cannot be mounted to null element.");
    }
    if (slides.length === 0) {
      throw new Error("Presentation requires at least one slide");
    }

    this.title = title;
    this.element = element;
    this.slides = slides;
    this.options = {
      width: 3840,
      height: 2160,
      backgroundColor: "#ffffff",
      fonts: [],
      stateCacheTTL: 15,
      ...options,
    };
    this.presentationState = {
      currentSlide: 0,
    };
    this.boundingBox = new BoundingBox(
      { x: 0, y: 0 },
      this.options.width,
      this.options.height,
    );

    this.container = null;
    this.svg = null;
    this.shadow = null;
    this.background = null;
    this.additionalElementContainer = null;
    this.textCommand = { active: false, command: "" };
    this.slideCleanupHandlers = [];

    // Set up shortcuts
    this.shortcuts = {
      // First build of first slide
      s: { slideIndex: 0, animationIndex: 0 },
      // First build of current slide, has the effecxt of re-loading a slide
      c: { slideIndex: null, animationIndex: 0 },
      // Last build of last slide
      e: {
        slideIndex: slides.length - 1,
        animationIndex: slides[slides.length - 1].animations.length,
      },
    };

    // Add numbered shortcuts for each slide
    for (let i = 0; i < slides.length; i++) {
      this.shortcuts[(i + 1).toString()] = { slideIndex: i, animationIndex: 0 };
    }

    // Add custom shortcuts on particular slides
    slides.forEach((slide, slideIndex) => {
      slide.props.shortcuts.forEach((shortcut) => {
        const shortcutText =
          typeof shortcut === "string" ? shortcut : shortcut[0];
        const animationIndex = typeof shortcut === "string" ? 0 : shortcut[1];
        this.shortcuts[shortcutText] = {
          slideIndex: slideIndex,
          animationIndex: animationIndex,
        };
      });
    });
  }

  present() {
    // Create container element.
    this.container = document.createElement("div");
    this.container.style.width = "100%";
    this.container.style.aspectRatio = `${this.options.width} / ${this.options.height}`;

    // Set container to be vertically centered.
    this.container.style.position = "relative";
    this.container.style.top = "50%";
    this.container.style.transform = "translateY(-50%)";

    // Set container to be horizontally centered.
    this.container.style.marginLeft = "auto";
    this.container.style.marginRight = "auto";

    // Create SVG element.
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.style.backgroundColor = "transparent";
    this.svg.style.cursor = "none";

    // Set up keyboard commands.
    this.setupKeyboardCommands();

    // Create shadow element that's hidden from view.
    this.shadow = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.shadow.style.visibility = "hidden";

    // Create element that's just used for the background color.
    this.background = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );
    this.background.style.backgroundColor = this.options.backgroundColor;

    this.additionalElementContainer = document.createElement("div");
    this.additionalElementContainer.style.width = "100%";
    this.additionalElementContainer.style.height = "100%";
    this.additionalElementContainer.style.position = "absolute";

    [this.svg, this.shadow, this.background].forEach((svg) => {
      svg.setAttribute("width", "100%");
      svg.setAttribute(
        "viewBox",
        `0 0 ${this.options.width} ${this.options.height}`,
      );
      svg.style.position = "absolute";
    });

    if (this.isFullBodyPresentation()) {
      // Set document title.
      document.title = this.title;

      // Set root element styles.
      document.documentElement.style.height = "100%";

      // Set body styles.
      document.body.style.height = "100%";
      document.body.style.width = "100%";
      document.body.style.margin = "0";
      document.body.style.backgroundColor = "#000000";

      // Update SVG size when aspect ratio changes.
      window
        .matchMedia(
          `(min-aspect-ratio: ${this.options.width} / ${this.options.height})`,
        )
        .addEventListener("change", this.updateSVGContainerSize.bind(this));

      this.updateSVGContainerSize();
    }

    this.navigatorContainer = document.createElement("div");
    this.navigatorContainer.style.position = "absolute";
    this.navigatorContainer.style.height = "100%";
    this.navigatorContainer.style.width = "200px";
    this.navigatorContainer.style.backgroundColor = "#e6e6e6";
    this.navigatorContainer.style.overflow = "scroll";
    this.navigatorContainer.style.display = "none";

    // Add slides to the navigator container
    this.slides.forEach((slide, index) => {
      const slideElement = document.createElement("button");
      slideElement.style.display = "block";
      slideElement.style.margin = "10px";
      slideElement.style.padding = "10px";
      slideElement.style.width = "calc(100% - 20px)";
      slideElement.style.textAlign = "left";
      slideElement.style.backgroundColor = "transparent";
      slideElement.style.border = "none";
      slideElement.style.cursor = "pointer";
      slideElement.innerHTML = `${index + 1}`;
      if (slide.props.title !== null) {
        slideElement.innerHTML += `: ${slide.props.title}`;
      }
      slideElement.addEventListener("click", () => {
        this.navigatorContainer.style.display = "none";
        this.renderSlide(index);
      });
      this.navigatorContainer.appendChild(slideElement);
    });

    this.container.appendChild(this.shadow);
    this.container.appendChild(this.background);
    this.container.appendChild(this.additionalElementContainer);
    this.container.appendChild(this.svg);
    this.container.appendChild(this.navigatorContainer);
    this.element.appendChild(this.container);

    // Set up presentation state
    const restored = restorePresentationState(this, this.options.stateCacheTTL);
    if (!restored) {
      this.renderSlide(0);
    }
  }

  /**
   * Renders a slide.
   */
  renderSlide(slideIndex: number, animationIndex: number | "last" = 0) {
    const slide = this.slides[slideIndex];
    if (slide === undefined) {
      return;
    }
    this.presentationState.currentSlide = slideIndex;
    slide.render(
      this,
      animationIndex === "last" ? slide.animations.length : animationIndex,
    );
    storePresentationState(this);
  }

  /**
   * Sets up keyboard commands for the presentation.
   */
  setupKeyboardCommands() {
    const eventTarget = this.isFullBodyPresentation()
      ? document.body
      : this.container;
    (eventTarget as HTMLElement).addEventListener(
      "keyup",
      this.handleKeyboardEvent.bind(this),
    );

    // Show cursor when the cursor moves.
    eventTarget.addEventListener("mousemove", () => {
      this.svg.style.cursor = "auto";
    });
  }

  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.resetTextCommand();
      return;
    }

    if (event.key === "ArrowRight" || event.key === " ") {
      this.resetTextCommand();
      this.next(!event.shiftKey);
      return;
    }

    if (event.key === "ArrowLeft") {
      this.resetTextCommand();
      this.previous(!event.shiftKey);
      return;
    }

    // Check for an active text command
    if (this.textCommand.active) {
      // Submitting a text command
      if (event.key === "Enter") {
        const { command } = this.textCommand;
        this.resetTextCommand();

        // Check for a valid shortcut
        const shortcut = this.shortcuts[command];
        if (shortcut === undefined) {
          return;
        }

        // Before going to a new slide, set up a "back" shortcut
        // (accessible via "gb") that goes back to where the user came from.
        const currentSlide = this.slides[this.presentationState.currentSlide];
        this.shortcuts["b"] = {
          slideIndex: this.presentationState.currentSlide,
          animationIndex: currentSlide.animationIndex,
        };

        // Render the slide specified by the shortcut
        let slideIndex =
          shortcut.slideIndex !== null
            ? shortcut.slideIndex
            : this.presentationState.currentSlide;
        this.renderSlide(slideIndex, shortcut.animationIndex);
        return;
      }

      // Adding to a new text command
      if (event.key === "Backspace") {
        this.textCommand.command = this.textCommand.command.slice(0, -1);
      } else {
        this.textCommand.command += event.key;
      }
    } else if (event.key === "g") {
      // We've started a new text command
      this.textCommand.active = true;
      this.textCommand.command = "";
    } else if (event.key === "`") {
      const navigatorVisible =
        this.navigatorContainer.style.display === "block";
      this.navigatorContainer.style.display = navigatorVisible
        ? "none"
        : "block";
    }
  }

  resetTextCommand() {
    this.textCommand.active = false;
    this.textCommand.command = "";
  }

  /**
   * Updates the size of the parent SVG element.
   *
   * The size of the parent SVG element needs to be updated.
   */
  updateSVGContainerSize() {
    if (
      window.innerHeight / window.innerWidth >
      this.options.height / this.options.width
    ) {
      this.container.style.width = "100%";
      this.container.style.height = "auto";
    } else {
      this.container.style.width = "auto";
      this.container.style.height = "100%";
    }
  }

  /**
   * Advances to next animation in slide, or next slide if there is no next animation.
   * Returns true if we were able to successfully advance.
   * @param includeIntermediateBuilds Determines whether to progress through builds.
   */
  async next(includeIntermediateBuilds: boolean): Promise<boolean> {
    this.svg.style.cursor = "none";
    const currentSlide = this.slides[this.presentationState.currentSlide];
    if (currentSlide === undefined) {
      return;
    }

    if (includeIntermediateBuilds) {
      const animationPerformed = await currentSlide.nextAnimation();
      if (animationPerformed) {
        storePresentationState(this);
        return;
      }
    }

    // If we didn't perform an animation, go to the next slide.
    this.renderSlide(this.presentationState.currentSlide + 1);
  }

  /**
   * Goes back to the previous slide.
   * @param includeIntermediateBuilds Determines whether to progress through builds.
   */
  previous(includeIntermediateBuilds: boolean) {
    this.svg.style.cursor = "none";

    const currentSlideIndex = this.presentationState.currentSlide;
    const currentSlide = this.slides[currentSlideIndex];

    // If we're not on the last build of the slide, go back one build.
    if (includeIntermediateBuilds && currentSlide.animationIndex > 0) {
      this.renderSlide(currentSlideIndex, currentSlide.animationIndex - 1);
      return;
    }

    // If we're on the first build, do nothing.
    if (
      includeIntermediateBuilds &&
      this.presentationState.currentSlide === 0
    ) {
      return;
    }

    // Go back to the previous slide.
    this.renderSlide(
      currentSlideIndex - 1,
      includeIntermediateBuilds ? "last" : 0,
    );
  }

  /**
   * Checks if the presentation takes the entire document body.
   * @returns True if the presentation takes the entire document body.
   */
  isFullBodyPresentation(): boolean {
    return this.element === document.body;
  }

  /**
   * Computes the current size of an element in the DOM.
   * Optionally accepts a custom list of children to see what the size of an
   * element would be with different children.
   * @param element Element to compute size of.
   * @param children Custom children to use for element.
   * @returns BoundingBox
   */
  computeRenderedBoundingBox(
    element: SVGGraphicsElement,
    children: Node[] | null = null,
  ): BoundingBox {
    // If we're computing the size of an element as-is that's already in the
    //  SVG canvas, get its bounding box directly.
    if (children === null && this.svg.contains(element)) {
      return BoundingBox.fromElement(element);
    }

    const clone = element.cloneNode(true) as SVGGraphicsElement;

    // If we have custom children, use them as the children of the element.
    if (children !== null) {
      clone.innerHTML = "";
      for (const child of children) {
        clone.appendChild(child.cloneNode(true));
      }
    }

    this.shadow.appendChild(clone);
    const boundingBox = BoundingBox.fromElement(clone);
    this.shadow.removeChild(clone);

    return boundingBox;
  }
}
