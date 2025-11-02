import { openNavigator } from "../../navigator/openNavigator";
import { Presentation } from "../../types/Presentation";
import { SlideObject } from "../../types/SlideObject";
import { getSlideAnimationDuration } from "../../utils/animate/getSlideAnimationDuration";
import { getRgbStringForColor } from "../../utils/color/getRgbStringForColor";
import { createPresentationContainer } from "../../utils/presentation/createPresentationContainer";
import { getObjectState } from "../../utils/presentation/getObjectState";
import { setupKeyEventListeners } from "../../utils/presentation/setupKeyEventListeners";
import { loadPresentationState } from "../../utils/storage/loadPresentationState";
import { storePresentationState } from "../../utils/storage/storePresentationState";
import { BrowserCanvasRendererProps } from "./types/BrowserCanvasRendererProps";
import {
  BROWSER_CANVAS_RENDERER_DEFAULT_STATE,
  BrowserCanvasRendererState,
} from "./types/BrowserCanvasRendererState";
import { CanvasContextType, UnifiedCanvasContext } from "./types/UnifiedCanvasContext";
import { clearCanvas } from "./utils/clearCanvas";
import { createCanvasElement } from "./utils/createCanvasElement";
import { createPath2D } from "./utils/createPath2D";
import { DEFAULT_OBJECT_RENDERERS } from "./utils/defaultObjectRenderers";
import { createExtrasElement } from "./utils/extras/createExtrasElement";
import { mountWebExtra } from "./utils/extras/mountWebExtra";
import { loadPresentationImages } from "./utils/loadPresentationImages";

export class BrowserCanvasRenderer {
  props: BrowserCanvasRendererProps;
  state: BrowserCanvasRendererState;

  constructor(props: Partial<BrowserCanvasRendererProps>) {
    const { objectRenderers, ...rest } = props;
    this.props = {
      presentation: Presentation(),
      element: document.body,
      objectRenderers: {
        ...DEFAULT_OBJECT_RENDERERS,
        ...objectRenderers,
      },
      cacheDurationMinutes: 15,
      ...rest,
    };
    this.state = { ...BROWSER_CANVAS_RENDERER_DEFAULT_STATE };
  }

  /** Starts the presentation. */
  async present(): Promise<void> {
    const { presentation, element } = this.props;
    const canvas = createCanvasElement(presentation.size);
    const extrasContainer = createExtrasElement(presentation.size);

    this.state = {
      ...BROWSER_CANVAS_RENDERER_DEFAULT_STATE,
      imageById: await loadPresentationImages(presentation.resources.images),
      canvas,
      extrasContainer,
    };

    const container = createPresentationContainer(presentation, element);

    setupKeyEventListeners(presentation, element, this.state.shortcutState, {
      onNext: (skipIntermediateBuilds: boolean) => this.next(skipIntermediateBuilds),
      onPrevious: (skipIntermediateBuilds: boolean) => this.previous(skipIntermediateBuilds),
      onRenderSlide: (slideIndex: number | null, buildIndex: number) => {
        // Set up a shortcut for going back to this slide/build
        this.state.shortcutState.shortcuts.b = {
          slideIndex: this.state.slideIndex,
          buildIndex: this.state.buildIndex,
        };

        this.renderSlide(slideIndex ?? this.state.slideIndex, buildIndex);
      },
      onShowNavigator: () =>
        openNavigator({
          presentation,
          onNavigateToSlide: (slideIndex) => this.renderSlide(slideIndex),
        }),
    });

    element.replaceChildren();
    container.appendChild(canvas);
    container.appendChild(extrasContainer);
    element.appendChild(container);

    const loadedState = loadPresentationState(presentation, this.props.cacheDurationMinutes);
    if (loadedState !== null) {
      this.renderSlide(loadedState.slideIndex, loadedState.buildIndex);
    } else {
      this.renderSlide(0);
    }
  }

  renderSlide(slideIndex: number, buildIndex: number = 0, buildTime: number | null = null): void {
    const { objectRenderers, presentation } = this.props;
    const { canvas, imageById } = this.state;

    const didSlideIndexChange = this.state.slideIndex !== slideIndex;
    this.state.slideIndex = slideIndex;
    this.state.buildIndex = buildIndex;

    // Store state in local storage
    if (buildTime === null) {
      storePresentationState({ title: presentation.title, slideIndex, buildIndex });
    }

    const slide = presentation.slides[slideIndex];
    if (slide === undefined || canvas === null) {
      return;
    }

    // Handle mounting/unmounting web extras when slide index changes.
    // Also handle it if there are no mounted extras but the slide has extras to mount
    // (e.g. on a presentation's first slide, where slide index will have stayed 0).
    if (
      didSlideIndexChange ||
      (this.state.mountedExtrasCleanups.length === 0 && slide.extras.length > 0)
    ) {
      // Clean up any existing extras
      for (const cleanup of this.state.mountedExtrasCleanups) {
        cleanup();
      }
      this.state.mountedExtrasCleanups = [];

      // Mount new extras
      for (const extra of slide.extras) {
        const cleanup = mountWebExtra(this.state.extrasContainer, extra);
        if (cleanup !== null) {
          this.state.mountedExtrasCleanups.push(cleanup);
        }
      }
    }

    const ctx = canvas.getContext("2d");
    if (ctx === null) {
      return;
    }

    const context: UnifiedCanvasContext = {
      type: CanvasContextType.Browser,
      context: ctx,
    };

    clearCanvas(canvas, context);

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
  }

  next(skipIntermediateBuilds: boolean = false) {
    const { presentation } = this.props;
    const { currentAnimationId, slideIndex, buildIndex } = this.state;

    this.props.element.style.cursor = "none";

    if (currentAnimationId !== null) {
      cancelAnimationFrame(currentAnimationId);
    }

    const currentSlide = presentation.slides[slideIndex];
    if (currentSlide === undefined) {
      return;
    }

    const nextAnimation = currentSlide.animations[buildIndex];

    if (nextAnimation !== undefined && !skipIntermediateBuilds) {
      const startTime = performance.now();
      const animationDuration = getSlideAnimationDuration(nextAnimation);

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;

        if (elapsed < animationDuration) {
          this.renderSlide(slideIndex, buildIndex + 1, elapsed);
          this.state.currentAnimationId = requestAnimationFrame(animate);
        } else {
          this.renderSlide(slideIndex, buildIndex + 1, null);
        }
      };

      this.state.currentAnimationId = requestAnimationFrame(animate);
    } else if (slideIndex + 1 < presentation.slides.length) {
      this.renderSlide(slideIndex + 1);
    }
  }

  previous(skipIntermediateBuilds: boolean = false) {
    const { currentAnimationId, slideIndex, buildIndex } = this.state;

    this.props.element.style.cursor = "none";

    if (currentAnimationId !== null) {
      cancelAnimationFrame(currentAnimationId);
    }

    if (buildIndex > 0) {
      if (skipIntermediateBuilds) {
        this.renderSlide(slideIndex, 0);
      } else {
        this.renderSlide(slideIndex, buildIndex - 1);
      }
    } else if (slideIndex > 0) {
      const previousSlide = this.props.presentation.slides[slideIndex - 1];
      const buildIndex = skipIntermediateBuilds ? 0 : (previousSlide?.animations.length ?? 0);

      this.renderSlide(slideIndex - 1, buildIndex);
    } else {
      this.renderSlide(0, 0);
    }
  }
}
