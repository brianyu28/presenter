export interface PowerPointRendererState {
  readonly imagePathById: Record<string, string>;
}

export const POWERPOINT_RENDERER_DEFAULT_STATE: PowerPointRendererState = Object.freeze({
  imagePathById: {},
});
