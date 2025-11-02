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

  // Undo transformations in reverse order, starting with rotation transformation
  ctx.context.translate(rotateOriginX, rotateOriginY);
  ctx.context.rotate((-rotation * Math.PI) / 180);
  ctx.context.translate(-rotateOriginX, -rotateOriginY);

  // Show indicator for rotation origin, to help with developing and debugging rotation
  if (group.rotateOriginPreviewSize > 0) {
    ctx.context.fillStyle = "red";
    ctx.context.beginPath();
    ctx.context.arc(rotateOriginX, rotateOriginY, group.rotateOriginPreviewSize, 0, 2 * Math.PI);
    ctx.context.fill();
  }

  // Undo translation and scale transformations
  ctx.context.scale(1 / group.scale, 1 / group.scale);
  ctx.context.translate(-boundingBox.origin.x, -boundingBox.origin.y);
};
