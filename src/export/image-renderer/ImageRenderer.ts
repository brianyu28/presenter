import path from "path";

import {
  CanvasContextType,
  UnifiedCanvasContext,
} from "../../renderer/browser-canvas/types/UnifiedCanvasContext";
import { DEFAULT_OBJECT_RENDERERS } from "../../renderer/browser-canvas/utils/defaultObjectRenderers";
import { Presentation } from "../../types/Presentation";
import { SlideObject } from "../../types/SlideObject";
import { getRgbStringForColor } from "../../utils/color/getRgbStringForColor";
import { getImagePathUrlById } from "../../utils/presentation/getImagePathUrlById";
import { getObjectState } from "../../utils/presentation/getObjectState";
import { getSvgImageUrlById } from "../../utils/presentation/getSvgImageUrlById";
import { createCanvasElement } from "../utils/createCanvasElement";
import { createPath2D } from "../utils/createPath2D";
import { getImageExportFrames } from "../utils/getImageExportFrames";
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
    const { presentation } = this.props;
    this.state = {
      ...IMAGE_RENDERER_DEFAULT_STATE,
      imageById: await loadPresentationImages(
        {
          ...getImagePathUrlById(presentation),
          ...presentation.resources.images,
          ...getSvgImageUrlById(presentation),
        },
        this.props.resourcePathPrefix,
      ),
      directoryName,
      startImageIndex,
    };

    for (const frame of getImageExportFrames(this.props)) {
      if (frame.imageIndex < startImageIndex) {
        continue;
      }

      await this.renderImage(frame.slideIndex, frame.buildIndex, frame.buildTime, frame.imageIndex);
    }
  }

  async renderImage(
    slideIndex: number,
    buildIndex: number,
    buildTime: number | null = null,
    targetImageIndex: number | null = null,
  ): Promise<void> {
    const { getFilenameForImage, objectRenderers, logFrequency, presentation } = this.props;
    const { directoryName, imageById, startImageIndex } = this.state;

    const imageIndex = targetImageIndex ?? this.state.imageIndex;
    this.state.imageIndex = imageIndex + 1;
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
        originalObject: object,
        imageById,
        object: currentObject,
        opacity,
        renderScale: 1,
        renderObject,
        getCurrentObject: <TObject extends SlideObject>(object: TObject) =>
          objectState.get(object) as TObject | undefined,
        createPath2D,
        slideSize: presentation.size,
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
