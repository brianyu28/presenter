import { Presentation } from "../../types/Presentation";
import { getSlideAnimationDuration } from "../../utils/animate/getSlideAnimationDuration";
import { getKeySlideBuildIndices } from "../../utils/slide/getKeySlideBuildIndices";

export interface ImageExportFrame {
  readonly imageIndex: number;
  readonly slideIndex: number;
  readonly buildIndex: number;
  readonly buildTime: number | null;
}

export interface GetImageExportFramesProps {
  readonly presentation: Presentation;
  readonly isAnimatedExport: boolean;
  readonly animationHoldFrames: number;
  readonly framesPerSecond: number;
}

export function* getImageExportFrames({
  presentation,
  isAnimatedExport,
  animationHoldFrames,
  framesPerSecond,
}: GetImageExportFramesProps): Generator<ImageExportFrame> {
  let imageIndex = 0;

  for (let slideIndex = 0; slideIndex < presentation.slides.length; slideIndex++) {
    const slide = presentation.slides[slideIndex];
    if (slide === undefined) {
      continue;
    }

    if (isAnimatedExport) {
      for (let i = 0; i < animationHoldFrames; i++) {
        yield { imageIndex: imageIndex++, slideIndex, buildIndex: 0, buildTime: null };
      }

      for (let animationIndex = 0; animationIndex < slide.animations.length; animationIndex++) {
        const animation = slide.animations[animationIndex];
        if (animation === undefined) {
          continue;
        }

        const durationMs = getSlideAnimationDuration(animation);
        const totalFrames = Math.ceil((durationMs / 1000) * framesPerSecond);

        for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
          yield {
            imageIndex: imageIndex++,
            slideIndex,
            buildIndex: animationIndex + 1,
            buildTime: frameIndex * (durationMs / totalFrames),
          };
        }

        for (let i = 0; i < animationHoldFrames; i++) {
          yield {
            imageIndex: imageIndex++,
            slideIndex,
            buildIndex: animationIndex + 1,
            buildTime: null,
          };
        }
      }
    } else {
      const keyBuildIndices = getKeySlideBuildIndices(slide);
      for (const buildIndex of keyBuildIndices) {
        yield { imageIndex: imageIndex++, slideIndex, buildIndex, buildTime: null };
      }
    }
  }
}
