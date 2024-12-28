import { BoundingBox, Position } from "../util/position";
import { Presentation } from "./presentation";
import { BuildFunction } from "../util/animation";

export type Anchor =
  | "topleft"
  | "top"
  | "topright"
  | "left"
  | "center"
  | "right"
  | "bottomleft"
  | "bottom"
  | "bottomright";

export interface ObjectProps {
  position: Position | null;
  opacity?: number;
  anchor: Anchor;
}

export class SlideObject<Props extends ObjectProps> {
  /**
   * Starting values for each property.
   */
  initialProps: Props;

  /**
   * Current values for each property.
   */
  props: Props;

  _presentation: Presentation | null;

  _element: SVGElement | null;

  _children: Node[];

  /**
   * Initializes a new object to include on a slide.
   * @param props Object properties.
   */
  constructor(props: Partial<Props>) {
    this.props = {
      position: { x: 0, y: 0 },
      anchor: "topleft",
      ...props,
    } as Props;
    this.initialProps = { ...this.props };
    this._element = null;
    this._presentation = null;
    this._children = [];
  }

  /**
   * Returns the tag name of the element.
   * @returns Tag name.
   */
  tagName(): string {
    return "g";
  }

  /**
   * Returns the DOM attributes that should be set for the element.
   * @returns Object with attribute names and values.
   */
  attributes(): Partial<Record<string, string>> {
    return {};
  }

  /**
   * Returns additional DOM attributes to be set for the element.
   * Some attributes can't be computed until after an element's other properties are set:
   * e.g. text position depends on content and font size.
   * Additional attributes are computed after all other attributes, styles, and children.
   * @returns Object with attribute names and values.
   */
  additionalAttributes(): Partial<Record<string, string>> {
    return {};
  }

  /**
   * Returns the styles that should be set for the element.
   * @returns Object with style names and values.
   */
  styles(): Partial<Record<string, string>> {
    const { opacity } = this.props;
    return {
      ...(opacity !== undefined ? { opacity: opacity.toString() } : {}),
    };
  }

  /**
   * Returns the children that should be rendered for the object.
   * @returns Array of SVG elements.
   */
  children(): Node[] {
    return [];
  }

  /**
   * Given a set of prop updates, checks if the children of the object need to be updated.
   * @param props Properties to update.
   * @returns Boolean indicating whether children need to be updated.
   */
  requiresChildrenUpdate(props: Partial<Props>): boolean {
    return false;
  }

  /**
   * Given a particular initial bounding box, returns the DOM position attributes that should be set for the element.
   * @param bbox Bounding box.
   * @returns Object with attribute names and values.
   */
  positionAttributes(bbox: BoundingBox): any {
    if (this._presentation === null) {
      throw new Error(
        "Cannot compute object position attributes without presentation",
      );
    }
    const { x, y } = this.positionInPresentation(bbox.origin);
    const anchoredBox = this.anchorBoundingBox(
      new BoundingBox({ x, y }, bbox.width, bbox.height),
    );
    return { x: anchoredBox.origin.x, y: anchoredBox.origin.y };
  }

  /**
   * Re-generates the SVG element for the object.
   * @param presentation Presentation object.
   * @returns SVG element.
   */
  generate(presentation: Presentation): SVGElement {
    // Re-set values of all properties.
    this.props = { ...this.initialProps };
    this._presentation = presentation;

    const element = this.createElement();

    // Set attributes
    for (const [attribute, value] of Object.entries(this.attributes())) {
      element.setAttribute(attribute, value);
    }

    // Set styles
    for (const [style, value] of Object.entries(this.styles())) {
      element.style.setProperty(style, value);
    }

    // Set children
    this._children = this.children();
    for (const child of this._children) {
      element.appendChild(child);
    }

    this._element = element;

    // Set additional attributes
    for (const [attribute, value] of Object.entries(
      this.additionalAttributes(),
    )) {
      element.setAttribute(attribute, value);
    }

    return element;
  }

  /**
   * Creates a new HTML element for the object.
   */
  createElement(): SVGElement {
    return document.createElementNS(
      "http://www.w3.org/2000/svg",
      this.tagName(),
    );
  }

  /**
   * Returns the element for the object.
   * @returns SVG element.
   */
  element(): SVGElement {
    if (this._element === null) {
      throw new Error("Element not yet generated");
    }
    return this._element;
  }

  /**
   * Returns an animation to perform.
   * @param props Properties of object to change.
   * @param animationParams Animation behavior parameters.
   * @returns Animation build function.
   */
  animate(
    props: Partial<Props>,
    animationParams: anime.AnimeParams = {},
    delay: number | null = null,
    animate: boolean = true,
  ): BuildFunction {
    return (run) => {
      if (this._presentation === null) {
        throw new Error("Cannot animate object without presentation");
      }

      // Get new attributes and styles
      const requiresChildrenUpdate = this.requiresChildrenUpdate(props);
      this.props = { ...this.props, ...props };
      if (requiresChildrenUpdate) {
        this._children = this.children();
      }
      const newAttributes = this.attributes();
      const newStyles = this.styles();
      const newAdditionalAttributes = this.additionalAttributes();

      // Get changes in attributes and styles
      const attributeChanges = Object.fromEntries(
        Object.entries(newAttributes).filter(
          ([key, value]) => this._element.getAttribute(key) !== value,
        ),
      );
      const styleChanges = Object.fromEntries(
        Object.entries(newStyles).filter(
          ([key, value]) => this._element.style.getPropertyValue(key) !== value,
        ),
      );
      const additionalAttributeChanges = Object.fromEntries(
        Object.entries(newAdditionalAttributes).filter(
          ([key, value]) => this._element.getAttribute(key) !== value,
        ),
      );

      run({
        animate,
        element: this.element(),
        attributes: {
          ...attributeChanges,
          ...additionalAttributeChanges,
        },
        styles: styleChanges,
        ...(delay !== null ? { delay } : {}),
        ...(requiresChildrenUpdate ? { children: this._children } : {}),
        animationParams: {
          duration: 500,
          easing: "linear",
          ...animationParams,
          ...(animationParams.easing === "cubic"
            ? { easing: "cubicBezier(0.42, 0, 0.58, 1)" }
            : {}),
        },
      });
    };
  }

  /**
   * Returns an update animation that skips the animation and just performs the change.
   * @param props Properties of object to change.
   */
  set(props: Partial<Props>, delay: number | null = null): BuildFunction {
    return this.animate(props, {}, delay, false);
  }

  /**
   * Animates a movement of the object.
   */
  move(
    position: Position,
    animationParams: anime.AnimeParams = {},
  ): BuildFunction {
    return this.animate({ position } as Partial<Props>, animationParams);
  }

  /**
   * Allow for x and y values to be interpreted as percentages of total width/height.
   */
  positionInPresentation(position: Position): Position {
    const presentation = this._presentation;
    let { x, y } = position;

    // If values are in [-1, 1], treat them as a proportion of total width/height.
    if (x <= 1 && x >= -1) {
      x = x * presentation.boundingBox.width;
    }
    if (y <= 1 && y >= -1) {
      y = y * presentation.boundingBox.height;
    }

    return { x, y };
  }

  /**
   * Adjusts a bounding box to be anchored given the object's vertical and horizontal anchor settings.
   * @param bbox Bounding box to anchor.
   * @returns Anchored bounding box.
   */
  anchorBoundingBox(bbox: BoundingBox): BoundingBox {
    const y = (() => {
      switch (this.props.anchor) {
        case "topleft":
        case "top":
        case "topright":
          return bbox.origin.y;
        case "left":
        case "center":
        case "right":
          return bbox.origin.y - bbox.height / 2;
        case "bottomleft":
        case "bottom":
        case "bottomright":
          return bbox.origin.y - bbox.height;
      }
    })();

    const x = (() => {
      switch (this.props.anchor) {
        case "topleft":
        case "left":
        case "bottomleft":
          return bbox.origin.x;
        case "top":
        case "center":
        case "bottom":
          return bbox.origin.x - bbox.width / 2;
        case "topright":
        case "right":
        case "bottomright":
          return bbox.origin.x - bbox.width;
      }
    })();

    return new BoundingBox({ x, y }, bbox.width, bbox.height);
  }

  /**
   * Computes a bounding box for a given element given its rendered size and defined position.
   * @param element Element for which to compute size.
   * @param children Custom children to use when computing bounding box.
   * @returns
   */
  computeRenderedBoundingBox(
    element: SVGGraphicsElement,
    children: Node[] | null = null,
  ): BoundingBox {
    const renderedBoundingBox = this._presentation.computeRenderedBoundingBox(
      element,
      children,
    );

    const box = new BoundingBox(
      {
        x: this.props.position.x,
        y: this.props.position.y,
      },
      renderedBoundingBox.width,
      renderedBoundingBox.height,
    );

    return box;
  }
}
