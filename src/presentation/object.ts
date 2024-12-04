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

  positionInPresentation(presentation: Presentation): Position {
    const position = this.props.position;
    if (position === null) {
      throw new Error("Object has no position");
    }

    // Allow for x and y values to be interpreted as percentages of total width/height.
    const x =
      position.x <= 1
        ? position.x * presentation.boundingBox.width
        : position.x;
    const y =
      position.y <= 1
        ? position.y * presentation.boundingBox.height
        : position.y;

    return { x, y };
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
  ): BoundingBox {
    let { x: initialX, y: initialY } =
      this.positionInPresentation(presentation);
    const renderedBoundingBox =
      presentation.computeRenderedBoundingBox(element);

    // Allow adjusting the initialY value if the bounding box height
    if (renderedBoundingBox.origin.y !== 0) {
      initialY -= renderedBoundingBox.height + renderedBoundingBox.origin.y;
    }

    return this.anchorBoundingBox(
      new BoundingBox(
        { x: initialX, y: initialY },
        renderedBoundingBox.width,
        renderedBoundingBox.height,
      ),
    );
  }

  /**
   * Computes a bounding box for a given element given its width and height.
   * Unlike `computeRenderedBoundingBox`, uses width and height inputs rather than computing a rendered size.
   * @param presentation
   * @param width
   * @param height
   */
  computeBoundingBox(
    presentation: Presentation,
    width: number,
    height: number,
  ): BoundingBox {
    const { x, y } = this.positionInPresentation(presentation);
    return this.anchorBoundingBox(new BoundingBox({ x, y }, width, height));
  }
}
