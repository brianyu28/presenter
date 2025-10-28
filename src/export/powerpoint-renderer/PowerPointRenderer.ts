import pptxgen from "pptxgenjs";

import {
  CanvasContextType,
  UnifiedCanvasContext,
} from "../../renderer/browser-canvas/types/UnifiedCanvasContext";
import { Presentation } from "../../types/Presentation";
import { SlideObject } from "../../types/SlideObject";
import { getObjectState } from "../../utils/presentation/getObjectState";
import { getKeySlideBuildIndices } from "../../utils/slide/getKeySlideBuildIndices";
import { createCanvasElement } from "../utils/createCanvasElement";
import { DEFAULT_OBJECT_TRANSFORM, ObjectTransform } from "./types/ObjectTransform";
import { PowerPointRendererProps } from "./types/PowerPointRendererProps";
import {
  POWERPOINT_RENDERER_DEFAULT_STATE,
  PowerPointRendererState,
} from "./types/PowerPointRendererState";
import { DEFAULT_OBJECT_RENDERERS } from "./utils/defaultObjectRenderers";
import { getImagePathById } from "./utils/getImagePathById";
import { getPptxFillColor } from "./utils/getPptxFillColor";
import { getInchesFromPixels } from "./utils/getUnitsFromPixels";

export class PowerPointRenderer {
  props: PowerPointRendererProps;
  state: PowerPointRendererState;

  constructor(props: Partial<PowerPointRendererProps>) {
    const { objectRenderers, ...rest } = props;
    this.props = {
      presentation: Presentation(),
      objectRenderers: {
        ...DEFAULT_OBJECT_RENDERERS,
        ...objectRenderers,
      },
      pixelsPerInch: 384,
      resourcePathPrefix: "",
      ...rest,
    };
    this.state = { ...POWERPOINT_RENDERER_DEFAULT_STATE };
  }

  save(filename: string): void {
    const { presentation, pixelsPerInch, resourcePathPrefix } = this.props;
    this.state = {
      ...POWERPOINT_RENDERER_DEFAULT_STATE,
      imagePathById: getImagePathById(presentation.resources.images, resourcePathPrefix),
    };

    // Canvas used for temporary drawing and measurement, not for render output
    const canvas = createCanvasElement(presentation.size);
    const context: UnifiedCanvasContext = {
      type: CanvasContextType.Node,
      context: canvas.getContext("2d"),
    };

    const powerpoint = new pptxgen();
    powerpoint.defineLayout({
      name: "CUSTOM",
      width: getInchesFromPixels(presentation.size.width, pixelsPerInch),
      height: getInchesFromPixels(presentation.size.height, pixelsPerInch),
    });

    for (let slideIndex = 0; slideIndex < presentation.slides.length; slideIndex++) {
      const slide = presentation.slides[slideIndex];
      if (slide === undefined) {
        continue;
      }

      const keyBuildIndices = getKeySlideBuildIndices(slide);
      for (const buildIndex of keyBuildIndices) {
        this.addSlide(powerpoint, context, slideIndex, buildIndex);
      }
    }

    powerpoint.writeFile({ fileName: filename });
  }

  addSlide(
    powerpoint: pptxgen,
    context: UnifiedCanvasContext,
    slideIndex: number,
    buildIndex: number,
  ): void {
    const { objectRenderers, presentation, pixelsPerInch } = this.props;
    const { imagePathById } = this.state;
    const slide = presentation.slides[slideIndex];
    if (slide === undefined) {
      return;
    }

    const objectState = getObjectState({
      slide,
      buildIndex,
      buildTime: null,
    });

    const pptxSlide = powerpoint.addSlide();
    pptxSlide.background = getPptxFillColor(presentation.backgroundColor);

    function renderObject(object: SlideObject, transform: ObjectTransform, opacity: number) {
      const objectRenderer = objectRenderers[object.objectType];
      const currentObject = objectState.get(object);
      if (objectRenderer === undefined || currentObject === undefined) {
        return;
      }
      objectRenderer({
        ctx: context,
        imagePathById,
        object: currentObject,
        opacity,
        pixelsPerInch,
        powerpoint,
        renderObject,
        slide: pptxSlide,
        transform,
      });
    }

    // Render all objects in the slide.
    for (const object of slide.objects) {
      renderObject(object, DEFAULT_OBJECT_TRANSFORM, 1.0);
    }
  }
}
