import { Canvas } from "skia-canvas";

import {
  CanvasContextType,
  UnifiedCanvasContext,
} from "../../renderer/browser-canvas/types/UnifiedCanvasContext";
import { DEFAULT_OBJECT_RENDERERS } from "../../renderer/browser-canvas/utils/defaultObjectRenderers";
import { Presentation } from "../../types/Presentation";
import { SlideObject } from "../../types/SlideObject";
import { getRgbStringForColor } from "../../utils/color/getRgbStringForColor";
import { getObjectState } from "../../utils/presentation/getObjectState";
import { getKeySlideBuildIndices } from "../../utils/slide/getKeySlideBuildIndices";
import { createCanvasElement } from "../utils/createCanvasElement";
import { createPath2D } from "../utils/createPath2D";
import { loadPresentationImages } from "../utils/loadPresentationImages";
import { PDFRendererProps } from "./types/PDFRendererProps";
import { PDF_RENDERER_DEFAULT_STATE, PDFRendererState } from "./types/PDFRendererState";

export class PDFRenderer {
  props: PDFRendererProps;
  state: PDFRendererState;

  constructor(props: Partial<PDFRendererProps>) {
    const { objectRenderers, ...rest } = props;
    this.props = {
      presentation: Presentation(),
      objectRenderers: {
        ...DEFAULT_OBJECT_RENDERERS,
        ...objectRenderers,
      },
      resourcePathPrefix: "public",
      ...rest,
    };
    this.state = { ...PDF_RENDERER_DEFAULT_STATE };
  }

  async save(filename: string): Promise<void> {
    const { presentation } = this.props;
    this.state = {
      ...PDF_RENDERER_DEFAULT_STATE,
      imageById: await loadPresentationImages(
        presentation.resources.images,
        this.props.resourcePathPrefix,
      ),
    };

    const canvas = createCanvasElement(presentation.size);

    for (let slideIndex = 0; slideIndex < presentation.slides.length; slideIndex++) {
      const slide = presentation.slides[slideIndex];
      if (slide === undefined) {
        continue;
      }

      const keyBuildIndices = getKeySlideBuildIndices(slide);
      for (const buildIndex of keyBuildIndices) {
        this.addPage(canvas, slideIndex, buildIndex);
      }
    }

    await canvas.toFile(filename, { format: "pdf" });
  }

  addPage(canvas: Canvas, slideIndex: number, buildIndex: number): void {
    const { objectRenderers, presentation } = this.props;
    const { imageById } = this.state;
    const slide = presentation.slides[slideIndex];
    if (slide === undefined) {
      return;
    }

    const ctx = canvas.newPage(presentation.size.width, presentation.size.height);

    const context: UnifiedCanvasContext = {
      type: CanvasContextType.Node,
      context: ctx,
    };

    const objectState = getObjectState({
      slide,
      buildIndex,
      buildTime: null,
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
  }
}
