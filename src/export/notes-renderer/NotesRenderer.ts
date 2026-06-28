import { promises as fs } from "fs";
import path from "path";

import { ImageRenderer } from "../image-renderer/ImageRenderer";
import { NotesRendererProps } from "./types/NotesRendererProps";
import { getNotesEntries } from "./utils/getNotesEntries";
import { getTypstDocument } from "./utils/getTypstDocument";

export class NotesRenderer {
  private readonly imageRenderer: ImageRenderer;
  readonly props: NotesRendererProps;

  constructor(props: Partial<NotesRendererProps>) {
    const {
      author = null,
      description = null,
      imagesDirectoryName = "images",
      notesFilename = "notes.typ",
      slideWidth = 0.5,
      ...imageRendererProps
    } = props;

    this.imageRenderer = new ImageRenderer({
      ...imageRendererProps,
      isAnimatedExport: false,
    });
    this.props = {
      ...this.imageRenderer.props,
      author,
      description,
      imagesDirectoryName,
      notesFilename,
      slideWidth: Math.max(Math.min(slideWidth, 1), 0.01),
    };
  }

  async save(directoryName: string): Promise<void> {
    const imagesDirectoryName = path.join(directoryName, this.props.imagesDirectoryName);
    await fs.mkdir(imagesDirectoryName, { recursive: true });
    await this.imageRenderer.save(imagesDirectoryName);

    const { author, description, getFilenameForImage, presentation, slideWidth } = this.props;
    const document = getTypstDocument({
      author,
      description,
      entries: getNotesEntries({
        getFilenameForImage,
        imagesDirectoryName: this.props.imagesDirectoryName,
        presentation,
      }),
      slideWidth,
      title: presentation.title,
    });
    await fs.writeFile(path.join(directoryName, this.props.notesFilename), document);
  }
}
