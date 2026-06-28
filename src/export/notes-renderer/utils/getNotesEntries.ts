import path from "path";

import { Presentation } from "../../../types/Presentation";
import { getKeySlideBuildIndices } from "../../../utils/slide/getKeySlideBuildIndices";
import { getSpeakerNotesForBuildRange } from "../../../utils/slide/getSpeakerNotes";
import { NotesEntry } from "../types/NotesEntry";

interface GetNotesEntriesProps {
  readonly getFilenameForImage: (imageIndex: number) => string;
  readonly imagesDirectoryName: string;
  readonly presentation: Presentation;
}

export function getNotesEntries({
  getFilenameForImage,
  imagesDirectoryName,
  presentation,
}: GetNotesEntriesProps): NotesEntry[] {
  const entries: NotesEntry[] = [];
  let imageIndex = 0;

  presentation.slides.forEach((slide, slideIndex) => {
    let previousKeyBuildIndex = -1;

    for (const buildIndex of getKeySlideBuildIndices(slide)) {
      entries.push({
        caption: getCaption(
          slideIndex,
          presentation.slides.length,
          buildIndex,
          slide.animations.length,
        ),
        imageFilename: path.posix.join(
          toPosixPath(imagesDirectoryName),
          toPosixPath(getFilenameForImage(imageIndex)),
        ),
        notes: getSpeakerNotesForBuildRange(slide, previousKeyBuildIndex + 1, buildIndex),
        title: previousKeyBuildIndex === -1 && slide.title.length > 0 ? slide.title : null,
      });

      imageIndex += 1;
      previousKeyBuildIndex = buildIndex;
    }
  });

  return entries;
}

function getCaption(
  slideIndex: number,
  slideCount: number,
  buildIndex: number,
  buildCount: number,
): string {
  const slideCaption = `Slide ${slideIndex + 1} of ${slideCount}`;
  return buildCount === 0 ? slideCaption : `${slideCaption}, Build ${buildIndex} of ${buildCount}`;
}

function toPosixPath(filename: string): string {
  return filename.split(path.sep).join(path.posix.sep);
}
