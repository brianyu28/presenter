import { Anchor } from "../../types/Anchor";
import { BoundingBox } from "../../types/BoundingBox";
import { Position } from "../../types/Position";
import { Size } from "../../types/Size";
import { assertNever } from "../core/assertNever";

export function getBoundingBox(position: Position, anchor: Anchor, size: Size): BoundingBox {
  const { x, y } = position;
  const { width, height } = size;

  switch (anchor) {
    case Anchor.TOP_LEFT:
      return BoundingBox({
        origin: Position({ x, y }),
        size,
      });
    case Anchor.TOP:
      return BoundingBox({
        origin: Position({ x: x - width / 2, y }),
        size,
      });
    case Anchor.TOP_RIGHT:
      return BoundingBox({
        origin: Position({ x: x - width, y }),
        size,
      });
    case Anchor.LEFT:
      return BoundingBox({
        origin: Position({ x, y: y - height / 2 }),
        size,
      });
    case Anchor.CENTER:
      return BoundingBox({
        origin: Position({ x: x - width / 2, y: y - height / 2 }),
        size,
      });
    case Anchor.RIGHT:
      return BoundingBox({
        origin: Position({ x: x - width, y: y - height / 2 }),
        size,
      });
    case Anchor.BOTTOM_LEFT:
      return BoundingBox({
        origin: Position({ x, y: y - height }),
        size,
      });
    case Anchor.BOTTOM:
      return BoundingBox({
        origin: Position({ x: x - width / 2, y: y - height }),
        size,
      });
    case Anchor.BOTTOM_RIGHT:
      return BoundingBox({
        origin: Position({ x: x - width, y: y - height }),
        size,
      });
    default:
      assertNever(anchor);
  }
}
