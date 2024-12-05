import DefaultTheme from "../themes/default";
import { BoundingBox } from "../util/position";
import { Slide } from "./slide";
import { Theme } from "./theme";

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
   * Presentation theme to use.
   */
  theme: Theme;
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

    this.title = title;
    this.element = element;
    this.slides = slides;
    this.options = {
      width: 3840,
      height: 2160,
      theme: DefaultTheme,
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
    this.svg.style.backgroundColor = this.options.theme.backgroundColor;
    this.svg.style.cursor = "none";

    // Set up keyboard commands.
    const eventTarget = this.isFullBodyPresentation()
      ? document.body
      : this.svg;
    (eventTarget as HTMLElement).addEventListener("keyup", (event) => {
      if (event.key === "ArrowRight" || event.key === " ") {
        this.next();
      } else if (event.key === "ArrowLeft") {
        this.previous();
      }
    });

    // Show cursor when the cursor moves.
    eventTarget.addEventListener("mousemove", (event) => {
      this.svg.style.cursor = "auto";
    });

    // Create shadow element that's hidden from view.
    this.shadow = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.shadow.style.visibility = "hidden";

    [this.svg, this.shadow].forEach((svg) => {
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
      document.body.style.backgroundColor = "black";

      // Update SVG size when aspect ratio changes.
      window
        .matchMedia(
          `(min-aspect-ratio: ${this.options.width} / ${this.options.height})`,
        )
        .addEventListener("change", this.updateSVGContainerSize.bind(this));

      this.updateSVGContainerSize();
    }

    this.container.appendChild(this.shadow);
    this.container.appendChild(this.svg);
    this.element.appendChild(this.container);

    // Set up presentation state
    this.presentationState.currentSlide = 0;

    // Render slide
    const currentSlide = this.slides[this.presentationState.currentSlide];
    if (currentSlide === undefined) {
      return;
    }
    currentSlide.render(this);
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
   */
  next(): boolean {
    this.svg.style.cursor = "none";
    const currentSlide = this.slides[this.presentationState.currentSlide];
    if (currentSlide === undefined) {
      return;
    }

    if (!currentSlide.nextAnimation()) {
      this.presentationState.currentSlide++;
      const nextSlide = this.slides[this.presentationState.currentSlide];
      if (nextSlide === undefined) {
        return;
      }
      nextSlide.render(this);
    }
  }

  /**
   * Goes back to the previous slide.
   */
  previous(): boolean {
    this.svg.style.cursor = "none";

    // If we're past the end of the presentation, go to the last slide.
    const currentSlide = this.slides[this.presentationState.currentSlide];
    if (currentSlide === undefined) {
      this.presentationState.currentSlide = this.slides.length - 1;
      const lastSlide = this.slides[this.presentationState.currentSlide];
      if (lastSlide === undefined) {
        return;
      }
      lastSlide.render(this);
      return;
    }

    // If we're in the middle of a build, go back to the start of the build.
    if (currentSlide.animationIndex > 0) {
      currentSlide.animationIndex = 0;
      currentSlide.render(this);
      return;
    }

    // Otherwise, go back to the previous slide.
    if (this.presentationState.currentSlide === 0) {
      return;
    }
    this.presentationState.currentSlide--;
    const previousSlide = this.slides[this.presentationState.currentSlide];
    if (previousSlide === undefined) {
      return;
    }
    previousSlide.render(this);
  }

  /**
   * Checks if the presentation takes the entire document body.
   * @returns True if the presentation takes the entire document body.
   */
  isFullBodyPresentation(): boolean {
    return this.element === document.body;
  }

  theme(): Theme {
    return this.options.theme;
  }

  /**
   * Computes the current size of an element in the DOM.
   * @returns BoundingBox
   */
  computeRenderedBoundingBox(element: SVGGraphicsElement): BoundingBox {
    // If element is in the presentation, we can get the bounding box.
    if (this.svg.contains(element)) {
      return BoundingBox.fromElement(element);
    }

    // If element isn't in the presentation, we need to add it to the shadow element.
    this.shadow.appendChild(element);
    const boundingBox = BoundingBox.fromElement(element);
    this.shadow.removeChild(element);
    return boundingBox;
  }
}
