import { BrowserCanvasRenderer } from "../../renderer/browser-canvas/BrowserCanvasRenderer";
import { createCanvasElement } from "../../renderer/browser-canvas/utils/createCanvasElement";
import { loadPresentationImages } from "../../renderer/browser-canvas/utils/loadPresentationImages";
import { Presentation } from "../../types/Presentation";
import { getImagePathUrlById } from "../../utils/presentation/getImagePathUrlById";
import { getSvgImageUrlById } from "../../utils/presentation/getSvgImageUrlById";
import { getImageExportFrames, ImageExportFrame } from "../utils/getImageExportFrames";
import {
  BrowserImageFormat,
  BrowserImageRendererImage,
  BrowserImageRendererProps,
} from "./types/BrowserImageRendererProps";

export class BrowserImageRenderer {
  props: BrowserImageRendererProps;

  constructor(props: Partial<BrowserImageRendererProps>) {
    const { imageFormat = "png", ...rest } = props;
    this.props = {
      presentation: Presentation(),
      imageFormat,
      imageQuality: undefined,
      animationHoldFrames: 1,
      framesPerSecond: 30,
      isAnimatedExport: false,
      getFilenameForImage: (imageIndex: number) =>
        `${imageIndex.toString().padStart(4, "0")}.${imageFormat}`,
      logFrequency: 0,
      objectRenderers: {},
      onRenderImage: () => undefined,
      renderScale: 1,
      resourcePathPrefix: "",
      waitForFonts: true,
      ...rest,
    };
  }

  async render(startImageIndex: number = 0): Promise<void> {
    assertBrowserEnvironment();

    const { presentation } = this.props;
    const imageById = await loadPresentationImages(
      prefixImagePaths(
        {
          ...getImagePathUrlById(presentation),
          ...presentation.resources.images,
          ...getSvgImageUrlById(presentation),
        },
        this.props.resourcePathPrefix,
      ),
    );

    if (this.props.waitForFonts) {
      await document.fonts.ready;
    }

    const canvas = createCanvasElement(presentation.size);
    const renderer = new BrowserCanvasRenderer({
      presentation,
      objectRenderers: this.props.objectRenderers,
      scale: this.props.renderScale,
      element: document.createElement("div"),
    });
    renderer.state = {
      ...renderer.state,
      imageById,
    };

    for (const frame of getImageExportFrames(this.props)) {
      if (frame.imageIndex < startImageIndex) {
        continue;
      }

      await this.renderFrame(renderer, canvas, frame);
    }
  }

  private async renderFrame(
    renderer: BrowserCanvasRenderer,
    canvas: HTMLCanvasElement,
    frame: ImageExportFrame,
  ): Promise<void> {
    const { getFilenameForImage, imageFormat, imageQuality, logFrequency, onRenderImage } =
      this.props;

    renderer.renderCanvas(
      canvas,
      frame.slideIndex,
      frame.buildIndex,
      frame.buildTime,
      this.props.renderScale,
    );

    const blob = await canvasToBlob(canvas, getImageMimeType(imageFormat), imageQuality);
    const filename = getFilenameForImage(frame.imageIndex);
    const image: BrowserImageRendererImage = {
      ...frame,
      blob,
      filename,
    };

    await onRenderImage(image);
    if (logFrequency > 0 && frame.imageIndex % logFrequency === 0) {
      console.log(`Rendered image ${frame.imageIndex}: ${filename}`);
    }
  }
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  imageType: string,
  quality: number | undefined,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob === null) {
          reject(new Error("Unable to encode browser image export frame."));
          return;
        }
        resolve(blob);
      },
      imageType,
      quality,
    );
  });
}

function getImageMimeType(imageFormat: BrowserImageFormat): string {
  switch (imageFormat) {
    case "jpeg":
      return "image/jpeg";
    case "webp":
      return "image/webp";
    case "png":
      return "image/png";
  }
}

function prefixImagePaths(
  imagePathById: Record<string, string>,
  resourcePathPrefix: string,
): Record<string, string> {
  if (resourcePathPrefix === "") {
    return imagePathById;
  }

  const prefixedImagePathById: Record<string, string> = {};
  for (const [id, imagePath] of Object.entries(imagePathById)) {
    prefixedImagePathById[id] = shouldPrefixImagePath(imagePath)
      ? joinUrlPath(resourcePathPrefix, imagePath)
      : imagePath;
  }
  return prefixedImagePathById;
}

function shouldPrefixImagePath(imagePath: string): boolean {
  return (
    !imagePath.includes("</svg>") &&
    !imagePath.startsWith("/") &&
    !imagePath.startsWith("data:") &&
    !imagePath.startsWith("blob:") &&
    !/^[a-z][a-z0-9+.-]*:\/\//i.test(imagePath)
  );
}

function joinUrlPath(prefix: string, imagePath: string): string {
  return `${prefix.replace(/\/$/, "")}/${imagePath.replace(/^\//, "")}`;
}

function assertBrowserEnvironment(): void {
  if (typeof document === "undefined") {
    throw new Error("BrowserImageRenderer must run in a browser environment.");
  }
}
