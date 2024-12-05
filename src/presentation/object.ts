import anime from "animejs/lib/anime.es.js";

import { BoundingBox, Position } from "../util/position";
import { Presentation } from "./presentation";
import { Theme } from "./theme";

export interface ObjectProps {
  position: Position | null;
  verticalAnchor: "center" | "top" | "bottom";
  horizontalAnchor: "center" | "start" | "end";
}

export class SlideObject {
  props: ObjectProps;

  _element: SVGElement | null;

  constructor(props: Partial<ObjectProps>) {
    this.props = {
      position: null,
      verticalAnchor: "top",
      horizontalAnchor: "start",
      ...props,
    };
    this._element = null;
  }

  /* Generate and return the element. */
  generate(presentation: Presentation): SVGElement {
    return null;
  }

  element(): SVGElement {
    if (this._element === null) {
      throw new Error("Element not yet generated");
    }
    return this._element;
  }

  /**
   * Performs an animation on the object's element.
   */
  animate(params: anime.AnimeParams, presentation: Presentation | null = null) {
    const { bbox, ...remainingParams } = params;

    const processedParams = {
      ...remainingParams,
      // Position
      ...(bbox !== undefined
        ? this.computePositionAttributes(presentation, bbox)
        : {}),
      // Default cubic bezier easing
      ...(params.easing === "cubic"
        ? { easing: "cubicBezier(0.42, 0, 0.58, 1)" }
        : {}),
    };

    anime({
      targets: this.element(),
      duration: 500,
      easing: "linear",
      ...processedParams,
    });
  }

  /**
   * Returns an animation callback function that performs the animation.
   */
  animation(params: anime.AnimeParams): () => void {
    return () => this.animate(params);
  }

  /**
   * Performs a movement animation.
   * Meant to be overriden for object-specific movement.
   */
  animateMove(
    position: Position,
    params: anime.AnimeParams,
    presentation: Presentation,
  ) {
    this.animate({ x: position.x, y: position.y, ...params }, presentation);
  }

  /**
   * Allow for x and y values to be interpreted as percentages of total width/height.
   */
  positionInPresentation(
    presentation: Presentation,
    x: number,
    y: number,
  ): Position {
    const adjustedX = x <= 1 ? x * presentation.boundingBox.width : x;
    const adjustedY = y <= 1 ? y * presentation.boundingBox.height : y;
    return { x: adjustedX, y: adjustedY };
  }

  /**
   * Adjusts a bounding box to be anchored given the object's vertical and horizontal anchor settings.
   * @param bbox
   */
  anchorBoundingBox(bbox: BoundingBox): BoundingBox {
    const { verticalAnchor, horizontalAnchor } = this.props;
    const y = (() => {
      switch (verticalAnchor) {
        case "top":
          return bbox.origin.y;
        case "center":
          return bbox.origin.y - bbox.height / 2;
        case "bottom":
          return bbox.origin.y - bbox.height;
      }
    })();

    const x = (() => {
      switch (horizontalAnchor) {
        case "start":
          return bbox.origin.x;
        case "center":
          return bbox.origin.x - bbox.width / 2;
        case "end":
          return bbox.origin.x - bbox.width;
      }
    })();

    return new BoundingBox({ x, y }, bbox.width, bbox.height);
  }

  /**
   * Computes a bounding box for a given element given its rendered size and defined position.
   * @param element
   * @param presentation
   * @returns
   */
  computeRenderedBoundingBox(
    element: SVGGraphicsElement,
    presentation: Presentation,
    adjustY: boolean = false,
  ): BoundingBox {
    const renderedBoundingBox =
      presentation.computeRenderedBoundingBox(element);

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

  /**
   * Given a particular initial bounding box, returns the DOM attributes that should be set for the element.
   * Can be overriden by other elements.
   */
  computePositionAttributes(
    presentation: Presentation,
    bbox: BoundingBox,
  ): any {
    if (presentation === null) {
      throw new Error(
        "Cannot compute object position attributes without presentation",
      );
    }
    const { x, y } = this.positionInPresentation(
      presentation,
      bbox.origin.x,
      bbox.origin.y,
    );
    const anchoredBox = this.anchorBoundingBox(
      new BoundingBox({ x, y }, bbox.width, bbox.height),
    );
    return { x: anchoredBox.origin.x, y: anchoredBox.origin.y };
  }

  setPositionAttributes(
    presentation: Presentation,
    bbox: BoundingBox,
    element: SVGElement,
  ) {
    for (const [attribute, value] of Object.entries(
      this.computePositionAttributes(presentation, bbox),
    )) {
      element.setAttribute(attribute, value.toString());
    }
  }
}
