import { Group } from "../../../objects/Group";
import { Position } from "../../../types/Position";
import { Size } from "../../../types/Size";
import { getBoundingBox } from "../../../utils/layout/getBoundingBox";
import { BrowserCanvasObjectRenderer } from "../types/BrowserCanvasObjectRenderer";

export const renderGroup: BrowserCanvasObjectRenderer<Group> = ({
  ctx,
  object: group,
  renderObject,
  opacity,
}) => {
  const boundingBox = getBoundingBox(
    Position({ x: group.x, y: group.y }),
    group.anchor,
    Size({
      width: group.width * group.scale,
      height: group.height * group.scale,
    }),
  );

  const { rotation, rotateOriginX, rotateOriginY } = group;

  // Prevent rendering if scale is zero
  if (group.scale === 0) {
    return;
  }

  // Apply translation and scale transformations
  ctx.context.translate(boundingBox.origin.x, boundingBox.origin.y);
  ctx.context.scale(group.scale, group.scale);
  // Apply rotation transformation
  ctx.context.translate(rotateOriginX, rotateOriginY);
  ctx.context.rotate((rotation * Math.PI) / 180);
  ctx.context.translate(-rotateOriginX, -rotateOriginY);

  for (const child of group.objects) {
    renderObject(child, opacity * group.opacity);
  }

  // Undo transformations in reverse order
  ctx.context.translate(rotateOriginX, rotateOriginY);
  ctx.context.rotate((-rotation * Math.PI) / 180);
  ctx.context.translate(-rotateOriginX, -rotateOriginY);
  ctx.context.scale(1 / group.scale, 1 / group.scale);
  ctx.context.translate(-boundingBox.origin.x, -boundingBox.origin.y);
};
