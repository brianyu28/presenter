import { Size } from "../../../types/Size";
import { SlideObject } from "../../../types/SlideObject";
import { UnifiedCanvasContext } from "./UnifiedCanvasContext";
import { UnifiedImage } from "./UnifiedImage";
import { UnifiedPath2D } from "./UnifiedPath2D";

export interface BrowserCanvasObjectRendererArgs<T extends SlideObject> {
  readonly ctx: UnifiedCanvasContext;
  readonly object: T;
  /** Stable object reference before animations are applied, needed for 3D animation */
  readonly originalObject: SlideObject;
  readonly opacity: number;
  readonly renderScale: number;
  readonly slideSize: Size;

  readonly imageById: Record<string, UnifiedImage>;
  readonly createPath2D: (path?: string) => UnifiedPath2D;
  /**
   * Returns the current animated state for an original slide object reference.
   * Needed for ThreeScene to access animated state of child meshes.
   */
  readonly getCurrentObject: <TObject extends SlideObject>(object: TObject) => TObject | undefined;
  readonly renderObject: (object: SlideObject, overallOpacity: number) => void;
}

export type BrowserCanvasObjectRenderer<T extends SlideObject> = (
  args: BrowserCanvasObjectRendererArgs<T>,
) => void;
