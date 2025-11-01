import { Anchor } from "./Anchor";

/**
 * A "Web Extra" is additional HTML/JavaScript content added to a slide. This
 * allows embedded arbitrary web content on a slide. This content is not part of
 * the core slide content, and will not be produced by non-web renderers like
 * PDF/image renderers, but can be used to enhance web-based presentations.
 */
export interface SlideWebExtra {
  /** HTML element that will be added to the presentation. */
  readonly content: HTMLElement | null;

  /**
   * Setup function that will be called when the extra is mounted.
   * It can optionally return a cleanup function that will be called
   * when the extra is unmounted.
   */
  readonly setup: ((foreignObject: SVGForeignObjectElement) => void | (() => void)) | null;

  readonly anchor: Anchor;
  readonly height: number;
  readonly width: number;
  readonly x: number;
  readonly y: number;
}

export function SlideWebExtra(props: Partial<SlideWebExtra> | null = null): SlideWebExtra {
  return {
    content: null,
    setup: null,
    anchor: Anchor.TOP_LEFT,
    height: 0,
    width: 0,
    x: 0,
    y: 0,
    ...props,
  };
}
