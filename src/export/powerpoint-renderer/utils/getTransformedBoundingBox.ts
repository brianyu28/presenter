import { Anchor } from "../../../types/Anchor";
import { BoundingBox } from "../../../types/BoundingBox";
import { Position } from "../../../types/Position";
import { Size } from "../../../types/Size";
import { getBoundingBox } from "../../../utils/layout/getBoundingBox";
import { ObjectTransform } from "../types/ObjectTransform";

export function getTransformedBoundingBox(
  position: Position,
  anchor: Anchor,
  size: Size,
  transform: ObjectTransform,
): BoundingBox {
  return getBoundingBox(
    {
      x: position.x * transform.scale + transform.translateX,
      y: position.y * transform.scale + transform.translateY,
    },
    anchor,
    {
      width: size.width * transform.scale,
      height: size.height * transform.scale,
    },
  );
}
