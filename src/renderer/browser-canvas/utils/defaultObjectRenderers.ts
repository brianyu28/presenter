import { ObjectType } from "../../../types/ObjectType";
import { SlideObject } from "../../../types/SlideObject";
import { renderCircle } from "../objects/renderCircle";
import { renderGroup } from "../objects/renderGroup";
import { renderImage } from "../objects/renderImage";
import { renderLine } from "../objects/renderLine";
import { renderMask } from "../objects/renderMask";
import { renderPath } from "../objects/renderPath";
import { renderRectangle } from "../objects/renderRectangle";
import { renderText } from "../objects/renderText";
import { BrowserCanvasObjectRenderer } from "../types/BrowserCanvasObjectRenderer";

type ObjectRendererMap = {
  [T in ObjectType]: BrowserCanvasObjectRenderer<SlideObject & { objectType: T }>;
};

export const DEFAULT_OBJECT_RENDERERS: ObjectRendererMap = {
  [ObjectType.CIRCLE]: renderCircle,
  [ObjectType.GROUP]: renderGroup,
  [ObjectType.IMAGE]: renderImage,
  [ObjectType.LINE]: renderLine,
  [ObjectType.MASK]: renderMask,
  [ObjectType.PATH]: renderPath,
  [ObjectType.RECTANGLE]: renderRectangle,
  [ObjectType.SLIDE_OBJECT]: () => {},
  [ObjectType.TEXT]: renderText,
};
