import { DEFAULT_POSITION, Position } from "./Position";
import { DEFAULT_SIZE, Size } from "./Size";

export interface BoundingBox {
  /** The position of the top-left corner of the bounding box */
  readonly origin: Position;

  /** The size of the bounding box */
  readonly size: Size;
}

export function BoundingBox(props: Partial<BoundingBox> | null = null): BoundingBox {
  return {
    origin: DEFAULT_POSITION,
    size: DEFAULT_SIZE,
    ...props,
  };
}

export const DEFAULT_BOUNDING_BOX: BoundingBox = BoundingBox();
