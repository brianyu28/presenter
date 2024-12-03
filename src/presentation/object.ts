import { BoundingBox, Position } from "../util/position";
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
  generate(theme: Theme, bounds: BoundingBox): SVGElement {
    return null;
  }

  element(): SVGElement {
    if (this._element === null) {
      throw new Error("Element not yet generated");
    }
    return this._element;
  }
}
