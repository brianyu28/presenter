import { Mask } from "../../../objects/Mask";
import { Color } from "../../../types/Color";
import { Position } from "../../../types/Position";
import { Size } from "../../../types/Size";
import { getHexStringForColor } from "../../../utils/color/getHexStringForColor";
import { getBoundingBox } from "../../../utils/layout/getBoundingBox";
import { BrowserCanvasObjectRenderer } from "../types/BrowserCanvasObjectRenderer";

export const renderMask: BrowserCanvasObjectRenderer<Mask> = ({
  ctx,
  object: mask,
  opacity,
  renderObject,
}) => {
  ctx.context.save();

  const bbox = getBoundingBox(
    Position({ x: mask.x, y: mask.y }),
    mask.anchor,
    Size({ width: mask.width, height: mask.height }),
  );

  if (mask.preview) {
    ctx.context.lineWidth = 4;
    ctx.context.strokeStyle = getHexStringForColor(Color.RED);
    ctx.context.rect(bbox.origin.x, bbox.origin.y, bbox.size.width, bbox.size.height);
    ctx.context.stroke();
  }

  ctx.context.beginPath();
  ctx.context.rect(bbox.origin.x, bbox.origin.y, bbox.size.width, bbox.size.height);
  ctx.context.closePath();
  ctx.context.clip();

  for (const child of mask.objects) {
    renderObject(child, opacity * mask.opacity);
  }

  ctx.context.restore();
};
