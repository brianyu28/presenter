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
  ctx.save();

  const bbox = getBoundingBox(
    Position({ x: mask.x, y: mask.y }),
    mask.anchor,
    Size({ width: mask.width, height: mask.height }),
  );

  if (mask.preview) {
    ctx.lineWidth = 4;
    ctx.strokeStyle = getHexStringForColor(Color.RED);
    ctx.rect(bbox.origin.x, bbox.origin.y, bbox.size.width, bbox.size.height);
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.rect(bbox.origin.x, bbox.origin.y, bbox.size.width, bbox.size.height);
  ctx.closePath();
  ctx.clip();

  for (const child of mask.objects) {
    renderObject(child, opacity * mask.opacity);
  }

  ctx.restore();
};
