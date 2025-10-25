import { ObjectType } from "../../../types/ObjectType";
import { SlideObject } from "../../../types/SlideObject";
import { renderArrow } from "../objects/renderArrow";
import { renderCircle } from "../objects/renderCircle";
import { renderGroup } from "../objects/renderGroup";
import { renderImage } from "../objects/renderImage";
import { renderLine } from "../objects/renderLine";
import { renderMask } from "../objects/renderMask";
import { renderPath } from "../objects/renderPath";
import { renderPolygon } from "../objects/renderPolygon";
import { renderRectangle } from "../objects/renderRectangle";
import { renderText } from "../objects/renderText";
import { BrowserCanvasObjectRenderer } from "../types/BrowserCanvasObjectRenderer";

type ObjectRendererMap = {
  [T in ObjectType]: BrowserCanvasObjectRenderer<SlideObject & { objectType: T }>;
};

export const DEFAULT_OBJECT_RENDERERS: ObjectRendererMap = {
  [ObjectType.ARROW]: renderArrow,
  [ObjectType.CIRCLE]: renderCircle,
  [ObjectType.GROUP]: renderGroup,
  [ObjectType.IMAGE]: renderImage,
  [ObjectType.LINE]: renderLine,
  [ObjectType.MASK]: renderMask,
  [ObjectType.PATH]: renderPath,
  [ObjectType.POLYGON]: renderPolygon,
  [ObjectType.RECTANGLE]: renderRectangle,
  [ObjectType.SLIDE_OBJECT]: () => {},
  [ObjectType.TEXT]: renderText,
};
