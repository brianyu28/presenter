import { Group } from "../../../objects/Group";
import { Position } from "../../../types/Position";
import { Size } from "../../../types/Size";
import { ObjectTransform } from "../types/ObjectTransform";
import { PowerPointObjectRenderer } from "../types/PowerPointObjectRenderer";
import { getTransformedBoundingBox } from "../utils/getTransformedBoundingBox";

export const renderGroup: PowerPointObjectRenderer<Group> = ({
  object: group,
  opacity,
  transform,
  renderObject,
}) => {
  const targetOpacity = opacity * group.opacity;
  if (targetOpacity === 0) {
    return;
  }

  const boundingBox = getTransformedBoundingBox(
    Position({ x: group.x, y: group.y }),
    group.anchor,
    Size({
      width: group.width * group.scale,
      height: group.height * group.scale,
    }),
    transform,
  );

  const updatedTransform: ObjectTransform = {
    translateX: boundingBox.origin.x,
    translateY: boundingBox.origin.y,
    scale: group.scale * transform.scale,
    rotation: group.rotation + transform.rotation,
  };

  for (const child of group.objects) {
    renderObject(child, updatedTransform, targetOpacity);
  }

  return;
};
