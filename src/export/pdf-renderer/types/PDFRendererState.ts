import { UnifiedImage } from "../../../renderer/browser-canvas/types/UnifiedImage";

export interface PDFRendererState {
  imageById: Record<string, UnifiedImage>;
}

export const PDF_RENDERER_DEFAULT_STATE: PDFRendererState = Object.freeze({
  imageById: {},
});
