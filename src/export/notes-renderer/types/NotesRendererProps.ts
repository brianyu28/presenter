import { ImageRendererProps } from "../../image-renderer/types/ImageRendererProps";

export interface NotesRendererProps
  extends Omit<ImageRendererProps, "animationHoldFrames" | "framesPerSecond" | "isAnimatedExport"> {
  /** Optional author shown in the document header and embedded in PDF metadata. */
  readonly author: string | null;

  /**
   * Description shown in the document header and embedded in PDF metadata by Typst.
   * Defaults to the render date when null.
   */
  readonly description: string | null;

  /** Directory, relative to the output directory, where slide images are saved. */
  readonly imagesDirectoryName: string;

  /** The filename of the Typst document created inside the output directory. */
  readonly notesFilename: string;

  /** Width of each slide image as a proportion of the document's usable width. */
  readonly slideWidth: number;
}
