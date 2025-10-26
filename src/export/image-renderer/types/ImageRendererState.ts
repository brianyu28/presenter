import { UnifiedImage } from "../../../renderer/browser-canvas/types/UnifiedImage";

export interface ImageRendererState {
  directoryName: string;
  imageIndex: number;
  imageById: Record<string, UnifiedImage>;
  startImageIndex: number;
}

export const IMAGE_RENDERER_DEFAULT_STATE: ImageRendererState = Object.freeze({
  directoryName: "",
  imageIndex: 0,
  imageById: {},
  startImageIndex: 0,
});
