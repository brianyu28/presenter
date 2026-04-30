import { Group } from "../../../objects/Group";
import { Position } from "../../../types/Position";
import { Size } from "../../../types/Size";
import { getHexStringForColor } from "../../../utils/color/getHexStringForColor";
import { getBoundingBox } from "../../../utils/layout/getBoundingBox";
import { BrowserCanvasObjectRenderer } from "../types/BrowserCanvasObjectRenderer";

export const renderGroup: BrowserCanvasObjectRenderer<Group> = ({
  ctx,
  object: group,
  renderObject,
  opacity,
}) => {
  const scaleX = group.scale * group.scaleX;
  const scaleY = group.scale * group.scaleY;
  const boundingBox = getBoundingBox(
    Position({ x: group.x, y: group.y }),
    group.anchor,
    Size({
      width: group.width * Math.abs(scaleX),
      height: group.height * Math.abs(scaleY),
    }),
  );

  const { rotation, rotateOriginX, rotateOriginY, skewOriginX, skewOriginY, skewX, skewY } = group;

  // Prevent rendering if scale is zero
  if (scaleX === 0 || scaleY === 0) {
    return;
  }

  ctx.context.save();

  // Apply translation and scale transformations
  ctx.context.translate(boundingBox.origin.x, boundingBox.origin.y);
  ctx.context.scale(scaleX, scaleY);

  // Apply rotation transformation
  ctx.context.translate(rotateOriginX, rotateOriginY);
  ctx.context.rotate((rotation * Math.PI) / 180);
  ctx.context.translate(-rotateOriginX, -rotateOriginY);

  // Apply skew transformation
  ctx.context.translate(skewOriginX, skewOriginY);
  ctx.context.transform(
    1,
    Math.tan((skewY * Math.PI) / 180),
    Math.tan((skewX * Math.PI) / 180),
    1,
    0,
    0,
  );
  ctx.context.translate(-skewOriginX, -skewOriginY);

  for (const child of group.objects) {
    renderObject(child, opacity * group.opacity);
  }

  // If there's a preview color, render it to help with debugging group size/position
  if (group.previewColor !== null) {
    ctx.context.fillStyle = getHexStringForColor(group.previewColor);
    ctx.context.fillRect(0, 0, group.width, group.height);
  }

  // Show indicator for rotation origin, to help with developing and debugging rotation
  if (group.rotateOriginPreviewSize > 0) {
    ctx.context.fillStyle = "red";
    ctx.context.beginPath();
    ctx.context.arc(rotateOriginX, rotateOriginY, group.rotateOriginPreviewSize, 0, 2 * Math.PI);
    ctx.context.fill();
  }

  // Show indicator for skew origin, to help with developing and debugging skew
  if (group.skewOriginPreviewSize > 0) {
    ctx.context.fillStyle = "blue";
    ctx.context.beginPath();
    ctx.context.arc(skewOriginX, skewOriginY, group.skewOriginPreviewSize, 0, 2 * Math.PI);
    ctx.context.fill();
  }

  ctx.context.restore();
};
