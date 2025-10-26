import { type Image } from "skia-canvas";

export const ImageType = {
  Browser: "browser",
  Node: "node",
} as const;

export type ImageType = (typeof ImageType)[keyof typeof ImageType];

export interface BrowserImage {
  readonly type: typeof ImageType.Browser;
  readonly image: HTMLImageElement;
}

export interface NodeImage {
  readonly type: typeof ImageType.Node;
  readonly image: Image;
}

/**
 * A unified Image type that works in both browser and Node.js environments.
 */
export type UnifiedImage = BrowserImage | NodeImage;
