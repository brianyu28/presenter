import { BoundingBox } from "../util/position";
import { Slide } from "./slide";

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
   * Additional element container for elements that aren't part of the SVG.
   */
  additionalElementContainer: HTMLElement | null;

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
      backgroundColor: "#ffffff",
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
    this.additionalElementContainer = null;
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
    const background = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );
    background.style.backgroundColor = this.options.backgroundColor;

    this.additionalElementContainer = document.createElement("div");
    this.additionalElementContainer.style.width = "100%";
    this.additionalElementContainer.style.height = "100%";
    this.additionalElementContainer.style.position = "absolute";

    [this.svg, this.shadow, background].forEach((svg) => {
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

    this.container.appendChild(this.shadow);
    this.container.appendChild(background);
    this.container.appendChild(this.additionalElementContainer);
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
   * Sets up keyboard commands for the presentation.
   */
  setupKeyboardCommands() {
    const eventTarget = this.isFullBodyPresentation()
      ? document.body
      : this.container;
    (eventTarget as HTMLElement).addEventListener("keyup", (event) => {
      if (event.key === "ArrowRight" || event.key === " ") {
        this.next(!event.shiftKey);
      } else if (event.key === "ArrowLeft") {
        this.previous(!event.shiftKey);
      }
    });

    // Show cursor when the cursor moves.
    eventTarget.addEventListener("mousemove", (event) => {
      this.svg.style.cursor = "auto";
    });
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
  next(includeIntermediateBuilds: boolean): boolean {
    this.svg.style.cursor = "none";
    const currentSlide = this.slides[this.presentationState.currentSlide];
    if (currentSlide === undefined) {
      return;
    }

    if (!includeIntermediateBuilds || !currentSlide.nextAnimation()) {
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
   * @param includeIntermediateBuilds Determines whether to progress through builds.
   */
  previous(includeIntermediateBuilds: boolean) {
    this.svg.style.cursor = "none";

    const currentSlide = this.slides[this.presentationState.currentSlide];

    // If we're past the end of the presentation, go to the last slide.
    if (currentSlide === undefined) {
      this.presentationState.currentSlide = this.slides.length - 1;
      const lastSlide = this.slides[this.presentationState.currentSlide];
      if (lastSlide === undefined) {
        return;
      }
      lastSlide.render(
        this,
        includeIntermediateBuilds ? lastSlide.animations.length : 0,
      );
      return;
    }

    // If we're not on the last build, go back one build.
    if (includeIntermediateBuilds && currentSlide.animationIndex > 0) {
      currentSlide.render(this, currentSlide.animationIndex - 1);
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
    if (this.presentationState.currentSlide > 0) {
      this.presentationState.currentSlide--;
    }
    const previousSlide = this.slides[this.presentationState.currentSlide];
    if (previousSlide === undefined) {
      return;
    }
    previousSlide.render(
      this,
      includeIntermediateBuilds ? previousSlide.animations.length : 0,
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
