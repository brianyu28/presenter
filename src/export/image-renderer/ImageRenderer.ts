import path from "path";

import {
  CanvasContextType,
  UnifiedCanvasContext,
} from "../../renderer/browser-canvas/types/UnifiedCanvasContext";
import { DEFAULT_OBJECT_RENDERERS } from "../../renderer/browser-canvas/utils/defaultObjectRenderers";
import { Presentation } from "../../types/Presentation";
import { SlideObject } from "../../types/SlideObject";
import { getSlideAnimationDuration } from "../../utils/animate/getSlideAnimationDuration";
import { getRgbStringForColor } from "../../utils/color/getRgbStringForColor";
import { getObjectState } from "../../utils/presentation/getObjectState";
import { getKeySlideBuildIndices } from "../../utils/slide/getKeySlideBuildIndices";
import { createCanvasElement } from "../utils/createCanvasElement";
import { createPath2D } from "../utils/createPath2D";
import { loadPresentationImages } from "../utils/loadPresentationImages";
import { ImageRendererProps } from "./types/ImageRendererProps";
import { IMAGE_RENDERER_DEFAULT_STATE, ImageRendererState } from "./types/ImageRendererState";

export class ImageRenderer {
  props: ImageRendererProps;
  state: ImageRendererState;

  constructor(props: Partial<ImageRendererProps>) {
    const { objectRenderers, imageFormat = "png", ...rest } = props;
    this.props = {
      presentation: Presentation(),
      imageFormat,
      animationHoldFrames: 1,
      framesPerSecond: 30,
      isAnimatedExport: false,
      getFilenameForImage: (imageIndex: number) =>
        `${imageIndex.toString().padStart(4, "0")}.${imageFormat}`,
      logFrequency: 0,
      objectRenderers: {
        ...DEFAULT_OBJECT_RENDERERS,
        ...objectRenderers,
      },
      resourcePathPrefix: "",
      ...rest,
    };
    this.state = { ...IMAGE_RENDERER_DEFAULT_STATE };
  }

  async save(directoryName: string, startImageIndex: number = 0): Promise<void> {
    const { presentation, animationHoldFrames, isAnimatedExport } = this.props;
    this.state = {
      ...IMAGE_RENDERER_DEFAULT_STATE,
      imageById: await loadPresentationImages(
        presentation.resources.images,
        this.props.resourcePathPrefix,
      ),
      directoryName,
      startImageIndex,
    };

    for (let slideIndex = 0; slideIndex < presentation.slides.length; slideIndex++) {
      const slide = presentation.slides[slideIndex];
      if (slide === undefined) {
        continue;
      }

      if (isAnimatedExport) {
        for (let i = 0; i < animationHoldFrames; i++) {
          this.renderImage(slideIndex, 0);
        }

        for (let animationIndex = 0; animationIndex < slide.animations.length; animationIndex++) {
          const animation = slide.animations[animationIndex];
          if (animation === undefined) {
            continue;
          }

          const durationMs = getSlideAnimationDuration(animation);
          const totalFrames = Math.ceil((durationMs / 1000) * this.props.framesPerSecond);

          for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
            this.renderImage(
              slideIndex,
              animationIndex + 1,
              frameIndex * (durationMs / totalFrames),
            );
          }

          for (let i = 0; i < animationHoldFrames; i++) {
            this.renderImage(slideIndex, animationIndex + 1);
          }
        }
      } else {
        const keyBuildIndices = getKeySlideBuildIndices(slide);
        for (const buildIndex of keyBuildIndices) {
          this.renderImage(slideIndex, buildIndex);
        }
      }
    }
  }

  async renderImage(
    slideIndex: number,
    buildIndex: number,
    buildTime: number | null = null,
  ): Promise<void> {
    const { getFilenameForImage, objectRenderers, logFrequency, presentation } = this.props;
    const { directoryName, imageById, imageIndex, startImageIndex } = this.state;

    this.state.imageIndex += 1;
    if (imageIndex < startImageIndex) {
      return;
    }

    const filename = path.join(directoryName, getFilenameForImage(imageIndex));

    const slide = presentation.slides[slideIndex];
    if (slide === undefined) {
      return;
    }

    const canvas = createCanvasElement(presentation.size);
    const context: UnifiedCanvasContext = {
      type: CanvasContextType.Node,
      context: canvas.getContext("2d"),
    };

    const objectState = getObjectState({
      slide,
      buildIndex,
      buildTime,
    });

    // Render background color.
    context.context.fillStyle = getRgbStringForColor(presentation.backgroundColor);
    context.context.fillRect(0, 0, canvas.width, canvas.height);

    function renderObject(object: SlideObject, opacity: number) {
      const objectRenderer = objectRenderers[object.objectType];
      const currentObject = objectState.get(object);
      if (objectRenderer === undefined || currentObject === undefined) {
        return;
      }
      objectRenderer({
        ctx: context,
        imageById,
        object: currentObject,
        opacity,
        renderObject,
        createPath2D,
      });
    }

    // Render all objects in the slide.
    for (const object of slide.objects) {
      renderObject(object, 1.0);
    }

    await canvas.toFile(filename, { format: this.props.imageFormat });
    if (logFrequency > 0 && imageIndex % logFrequency === 0) {
      console.log(`Rendered image ${imageIndex}: ${filename}`);
    }
  }
}
