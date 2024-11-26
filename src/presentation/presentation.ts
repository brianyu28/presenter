import DefaultTheme from "../themes/default";
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
   * Parent SVG element of presentation.
   */
  svg: SVGSVGElement | null;

  /**
   * Presentation settings.
   */
  options: PresentationOptions;

  /**
   *
   * @param title Title of the presentation.
   */
  constructor(
    title: string,
    element: HTMLElement,
    options: Partial<PresentationOptions> = {},
  ) {
    if (this.element === null) {
      throw new Error("Presentation cannot be mounted to null element.");
    }

    this.title = title;
    this.element = element;
    this.svg = null;
    this.options = {
      width: 3840,
      height: 2160,
      theme: DefaultTheme,
      ...options,
    };
  }

  present() {
    // Create SVG element.
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.setAttribute("width", "100%");
    this.svg.setAttribute(
      "viewBox",
      `0 0 ${this.options.width} ${this.options.height}`,
    );
    this.svg.style.backgroundColor = this.options.theme.backgroundColor;

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
      document.body.style.display = "flex";
      document.body.style.justifyContent = "center";
      document.body.style.alignItems = "center";

      // Update SVG size when aspect ratio changes.
      window
        .matchMedia(
          `(min-aspect-ratio: ${this.options.width} / ${this.options.height})`,
        )
        .addEventListener("change", this.updateSVGParentSize.bind(this));

      this.updateSVGParentSize();
    }

    this.element.appendChild(this.svg);
  }

  /**
   * Updates the size of the parent SVG element.
   *
   * The size of the parent SVG element needs to be updated.
   */
  updateSVGParentSize() {
    if (
      window.innerHeight / window.innerWidth >
      this.options.height / this.options.width
    ) {
      this.svg.style.width = "100%";
      this.svg.style.height = "auto";
    } else {
      this.svg.style.width = "auto";
      this.svg.style.height = "100%";
    }
  }

  /**
   * Checks if the presentation takes the entire document body.
   * @returns True if the presentation takes the entire document body.
   */
  isFullBodyPresentation(): boolean {
    return this.element === document.body;
  }
}