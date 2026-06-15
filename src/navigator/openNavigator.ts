import { Presentation } from "../types/Presentation";
import { ShortcutState } from "../types/ShortcutState";
import { Slide } from "../types/Slide";
import { hasModifierKey } from "../utils/dom/hasModifierKey";
import { setupKeyEventListeners } from "../utils/presentation/setupKeyEventListeners";
import {
  markNavigatorClosedForHotReload,
  markNavigatorOpenForHotReload,
} from "./navigatorHotReload";

let navigatorWindow: Window | null = null;
let navigatorApi: NavigatorApi | null = null;
// Aborts listeners from the current navigator instance before replacing or closing it.
let navigatorCleanup: (() => void) | null = null;
// Stored on the navigator window to tell fresh callbacks apart from stale HMR callbacks.
const NAVIGATOR_INSTANCE_ID_KEY = "__presenterNavigatorInstanceId";

export let navigatorWindowBounds = {
  width: 700,
  height: 680,
  left: 20,
  top: 50,
};

interface Args {
  readonly presentation: Presentation;
  readonly shortcutState: ShortcutState;
  readonly onNavigateToSlide: (slideIndex: number) => void;
  readonly onRenderSlide: (slideIndex: number | null, buildIndex: number) => void;
  readonly onNext: (skipIntermediateBuilds?: boolean) => void;
  readonly onPrevious: (skipIntermediateBuilds?: boolean) => void;
  // Rebuilds an already-open navigator instead of focusing and reusing it.
  readonly forceRefresh?: boolean;
}

export interface NavigatorApi {
  readonly currentCanvas: HTMLCanvasElement;
  readonly nextCanvas: HTMLCanvasElement;
  readonly currentLabel: HTMLDivElement;
  readonly nextLabel: HTMLDivElement;
  readonly isOpen: () => boolean;
  readonly update: (
    slideIndex: number,
    buildIndex: number,
    nextSlideIndex: number | null,
    nextBuildIndex: number,
  ) => void;
}

type NavigatorElementApi = NavigatorApi & { readonly element: HTMLDivElement };

export function openNavigator({
  presentation,
  shortcutState,
  onNavigateToSlide,
  onRenderSlide,
  onNext,
  onPrevious,
  forceRefresh = false,
}: Args): NavigatorApi | null {
  if (navigatorWindow !== null && !navigatorWindow.closed) {
    saveNavigatorWindowBounds(navigatorWindow);

    if (!forceRefresh) {
      navigatorWindow.focus();
      return navigatorApi;
    }
  }

  if (navigatorWindow === null || navigatorWindow.closed) {
    navigatorWindow = window.open("", "Navigator", getNavigatorWindowFeatures());
  }

  if (navigatorWindow === null) {
    console.error("Failed to open navigator window.");
    return null;
  }

  navigatorCleanup?.();

  const navigatorInstance = createNavigatorInstance(navigatorWindow);
  // Lets a refreshed navigator detach the previous instance's window listeners.
  const abortController = new AbortController();
  navigatorCleanup = () => abortController.abort();
  const elementApi = createNavigatorElement(
    presentation,
    onNavigateToSlide,
    onNext,
    navigatorInstance.isActive,
  );
  navigatorApi = elementApi;
  markNavigatorOpenForHotReload();

  navigatorWindow.document.title = presentation.title;
  navigatorWindow.document.body.replaceChildren(elementApi.element);

  setupKeyEventListeners(
    presentation,
    elementApi.element,
    shortcutState,
    {
      onNext: (skipIntermediateBuilds: boolean) => {
        if (navigatorInstance.isActive()) {
          onNext(skipIntermediateBuilds);
        }
      },
      onPrevious: (skipIntermediateBuilds: boolean) => {
        if (navigatorInstance.isActive()) {
          onPrevious(skipIntermediateBuilds);
        }
      },
      onRenderSlide: (slideIndex, buildIndex) => {
        if (navigatorInstance.isActive()) {
          onRenderSlide(slideIndex, buildIndex);
        }
      },
      onShowNavigator: () => {
        if (navigatorInstance.isActive()) {
          closeNavigatorWindow();
        }
      },
    },
    {
      keyEventTarget: navigatorWindow,
      signal: abortController.signal,
    },
  );

  navigatorWindow.addEventListener("resize", () => saveNavigatorWindowBounds(navigatorWindow), {
    signal: abortController.signal,
  });
  navigatorWindow.addEventListener(
    "beforeunload",
    () => {
      saveNavigatorWindowBounds(navigatorWindow);
      markNavigatorClosedForHotReload();
    },
    {
      signal: abortController.signal,
    },
  );

  navigatorWindow.addEventListener(
    "keyup",
    (event) => {
      if (!navigatorInstance.isActive()) {
        return;
      }

      if (event.key === "Escape" || (event.key === "`" && !hasModifierKey(event))) {
        closeNavigatorWindow();
      }
    },
    {
      signal: abortController.signal,
    },
  );

  return navigatorApi;
}

export function createNavigatorElement(
  presentation: Presentation,
  onNavigateToSlide: (slideIndex: number) => void,
  onNext: () => void,
  isActive: () => boolean = () => true,
): NavigatorElementApi {
  const doc = navigatorWindow?.document ?? document;

  // Set up container
  const navigatorElement = doc.createElement("div");
  navigatorElement.style.boxSizing = "border-box";
  navigatorElement.style.display = "grid";
  navigatorElement.style.gridTemplateColumns = "260px 1fr";
  navigatorElement.style.gap = "18px";
  navigatorElement.style.height = "100vh";
  navigatorElement.style.overflow = "hidden";
  navigatorElement.style.padding = "18px";
  navigatorElement.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  navigatorElement.style.backgroundColor = "#f5f6f8";
  navigatorElement.style.color = "#1f2937";

  doc.body.style.margin = "0";
  doc.body.style.overflow = "hidden";

  // List of all slides on the left
  const slideList = doc.createElement("div");
  slideList.style.display = "flex";
  slideList.style.flexDirection = "column";
  slideList.style.gap = "8px";
  slideList.style.minHeight = "0";
  slideList.style.overflowY = "auto";
  slideList.style.paddingRight = "4px";

  // Preview of current and next slide
  const previewColumn = doc.createElement("div");
  previewColumn.style.display = "flex";
  previewColumn.style.flexDirection = "column";
  previewColumn.style.gap = "14px";
  previewColumn.style.minHeight = "0";
  previewColumn.style.minWidth = "0";
  previewColumn.style.overflow = "hidden";

  // Options to show what's visible in navigator
  const controls = doc.createElement("div");
  controls.style.display = "flex";
  controls.style.gap = "14px";
  controls.style.alignItems = "center";
  controls.style.flexWrap = "wrap";
  controls.style.fontSize = "13px";
  controls.style.color = "#4b5563";

  const previewGrid = doc.createElement("div");
  previewGrid.style.display = "flex";
  previewGrid.style.gap = "14px";
  previewGrid.style.flex = "1 1 auto";
  previewGrid.style.minHeight = "0";
  previewGrid.style.minWidth = "0";
  previewGrid.style.overflow = "hidden";

  const currentPreview = createPreviewElement("Current", presentation);
  const nextPreview = createPreviewElement("Next", presentation);
  nextPreview.container.style.cursor = "pointer";
  nextPreview.container.addEventListener("click", () => {
    if (isActive()) {
      onNext();
    }
  });

  const slideElements = presentation.slides.map((slide, index) => {
    const slideElement = createSlideElement(slide, index);
    slideElement.style.cursor = "pointer";
    slideElement.addEventListener("click", (event) => {
      if (!isActive()) {
        return;
      }

      // If shift key is pressed, close window
      if (event.shiftKey) {
        closeNavigatorWindow();
      }
      onNavigateToSlide(index);
    });
    slideList.appendChild(slideElement);
    return slideElement;
  });

  const slidesToggle = createToggleElement("Slides", slideList, true);
  const currentToggle = createToggleElement("Current", currentPreview.container, true);
  const nextToggle = createToggleElement("Next", nextPreview.container, true);

  const updateLayout = () => {
    const shouldStackPreviews =
      currentToggle.input.checked && nextToggle.input.checked && isNarrowPreviewLayout();
    navigatorElement.style.gridTemplateColumns = slidesToggle.input.checked ? "260px 1fr" : "1fr";
    previewGrid.style.flexDirection = shouldStackPreviews ? "column" : "row";
    currentPreview.container.style.flex = "1 1 0";
    nextPreview.container.style.flex = "1 1 0";
    requestAnimationFrame(() => {
      currentPreview.resize();
      nextPreview.resize();
    });
  };
  slidesToggle.input.addEventListener("change", updateLayout);
  currentToggle.input.addEventListener("change", updateLayout);
  nextToggle.input.addEventListener("change", updateLayout);
  navigatorWindow?.addEventListener("resize", updateLayout);

  controls.appendChild(slidesToggle.element);
  controls.appendChild(currentToggle.element);
  controls.appendChild(nextToggle.element);

  previewGrid.appendChild(currentPreview.container);
  previewGrid.appendChild(nextPreview.container);
  previewColumn.appendChild(controls);
  previewColumn.appendChild(previewGrid);
  navigatorElement.appendChild(slideList);
  navigatorElement.appendChild(previewColumn);

  function update(
    slideIndex: number,
    buildIndex: number,
    nextSlideIndex: number | null,
    nextBuildIndex: number,
  ) {
    if (!isActive()) {
      return;
    }

    slideElements.forEach((element, index) => {
      const isActive = index === slideIndex;
      element.style.backgroundColor = isActive ? "#dbeafe" : "#ffffff";
      element.style.borderColor = isActive ? "#60a5fa" : "#e5e7eb";
      element.style.color = isActive ? "#1e3a8a" : "#1f2937";
    });

    currentPreview.label.textContent = getBuildLabel(presentation, slideIndex, buildIndex);
    nextPreview.label.textContent = getBuildLabel(presentation, nextSlideIndex, nextBuildIndex);
    scrollSlideIntoView(slideElements[slideIndex], slideList);
    updateLayout();
  }

  function isNarrowPreviewLayout() {
    const win = navigatorWindow;
    if (win === null) {
      return false;
    }

    const slideListWidth = slidesToggle.input.checked ? 260 + 18 : 0;
    const availableWidth = win.innerWidth - 36 - slideListWidth;
    const availableHeight = win.innerHeight - 36 - controls.offsetHeight - 14;
    if (availableWidth <= 0 || availableHeight <= 0) {
      return false;
    }

    return availableWidth / availableHeight < 1.1;
  }

  return {
    element: navigatorElement,
    currentCanvas: currentPreview.canvas,
    nextCanvas: nextPreview.canvas,
    currentLabel: currentPreview.label,
    nextLabel: nextPreview.label,
    isOpen: () => navigatorWindow !== null && !navigatorWindow.closed,
    update,
  };
}

function createSlideElement(slide: Slide, slideIndex: number): HTMLDivElement {
  const doc = navigatorWindow?.document ?? document;
  const slideElement = doc.createElement("div");
  slideElement.style.display = "flex";
  slideElement.style.alignItems = "center";
  slideElement.style.gap = "10px";
  slideElement.style.padding = "8px 10px";
  slideElement.style.backgroundColor = "#ffffff";
  slideElement.style.border = "1px solid #e5e7eb";
  slideElement.style.borderRadius = "6px";
  slideElement.style.boxShadow = "0 1px 2px rgba(15, 23, 42, 0.06)";
  slideElement.style.fontSize = "14px";
  slideElement.style.lineHeight = "1";
  slideElement.style.userSelect = "none";

  const countElement = doc.createElement("div");
  countElement.textContent = `${slideIndex + 1}`;
  countElement.style.minWidth = "24px";
  countElement.style.fontWeight = "700";
  countElement.style.color = "#6b7280";

  const titleElement = doc.createElement("div");
  titleElement.textContent = slide.title.length > 0 ? slide.title : `Slide ${slideIndex + 1}`;
  titleElement.style.overflow = "hidden";
  titleElement.style.textOverflow = "ellipsis";
  titleElement.style.whiteSpace = "nowrap";

  slideElement.appendChild(countElement);
  slideElement.appendChild(titleElement);

  return slideElement;
}

function createPreviewElement(title: string, presentation: Presentation) {
  const doc = navigatorWindow?.document ?? document;
  const container = doc.createElement("div");
  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.flexDirection = "column";
  container.style.minHeight = "0";
  container.style.minWidth = "0";

  const titleElement = doc.createElement("div");
  titleElement.textContent = title;
  titleElement.style.marginBottom = "4px";
  titleElement.style.fontSize = "12px";
  titleElement.style.fontWeight = "700";
  titleElement.style.textAlign = "center";
  titleElement.style.textTransform = "uppercase";
  titleElement.style.color = "#6b7280";

  const label = doc.createElement("div");
  label.style.marginBottom = "6px";
  label.style.fontSize = "14px";
  label.style.fontWeight = "600";
  label.style.textAlign = "center";

  const frame = doc.createElement("div");
  frame.style.flex = "1 1 auto";
  frame.style.display = "flex";
  frame.style.alignItems = "flex-start";
  frame.style.justifyContent = "center";
  frame.style.minHeight = "0";
  frame.style.width = "100%";
  frame.style.overflow = "hidden";

  const canvas = doc.createElement("canvas");
  canvas.style.display = "block";
  canvas.style.width = "0";
  canvas.style.height = "0";

  function resize() {
    const frameWidth = frame.clientWidth;
    const frameHeight = frame.clientHeight;
    if (frameWidth <= 0 || frameHeight <= 0) {
      return;
    }

    const aspectRatio = presentation.size.width / presentation.size.height;
    const width = Math.min(frameWidth, frameHeight * aspectRatio);
    const height = width / aspectRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }

  const ResizeObserverCtor = doc.defaultView?.ResizeObserver;
  if (ResizeObserverCtor !== undefined) {
    new ResizeObserverCtor(resize).observe(frame);
  }
  navigatorWindow?.addEventListener("resize", resize);

  frame.appendChild(canvas);
  container.appendChild(titleElement);
  container.appendChild(label);
  container.appendChild(frame);

  return { container, label, canvas, resize };
}

function createToggleElement(
  label: string,
  target: HTMLElement,
  checked: boolean,
): { readonly element: HTMLLabelElement; readonly input: HTMLInputElement } {
  const doc = navigatorWindow?.document ?? document;
  const visibleDisplay = target.style.display || "block";
  const toggle = doc.createElement("label");
  toggle.style.display = "inline-flex";
  toggle.style.alignItems = "center";
  toggle.style.gap = "6px";
  toggle.style.userSelect = "none";

  const checkbox = doc.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = checked;
  checkbox.addEventListener("change", () => {
    target.style.display = checkbox.checked ? visibleDisplay : "none";
  });

  toggle.appendChild(checkbox);
  toggle.appendChild(doc.createTextNode(label));

  return { element: toggle, input: checkbox };
}

function getBuildLabel(
  presentation: Presentation,
  slideIndex: number | null,
  buildIndex: number,
): string {
  if (slideIndex === null) {
    return "End of presentation";
  }

  const slide = presentation.slides[slideIndex];
  if (slide === undefined) {
    return "No slide";
  }

  return `Slide ${slideIndex + 1} of ${presentation.slides.length}, Build ${buildIndex + 1} of ${
    slide.animations.length + 1
  }`;
}

function scrollSlideIntoView(slideElement: HTMLDivElement | undefined, slideList: HTMLDivElement) {
  if (slideElement === undefined) {
    return;
  }

  const slideTop = slideElement.offsetTop;
  const slideBottom = slideTop + slideElement.offsetHeight;
  const listTop = slideList.scrollTop;
  const listBottom = listTop + slideList.clientHeight;

  if (slideTop < listTop || slideBottom > listBottom) {
    slideElement.scrollIntoView({ block: "nearest" });
  }
}

function closeNavigatorWindow(): void {
  saveNavigatorWindowBounds(navigatorWindow);
  markNavigatorClosedForHotReload();
  navigatorCleanup?.();
  navigatorWindow?.close();
  navigatorWindow = null;
  navigatorApi = null;
  navigatorCleanup = null;
}

function getNavigatorWindowFeatures(): string {
  const { width, height, left, top } = navigatorWindowBounds;
  return `width=${width},height=${height},left=${left},top=${top}`;
}

function saveNavigatorWindowBounds(win: Window | null): void {
  if (win === null || win.closed) {
    return;
  }

  navigatorWindowBounds = {
    width: win.outerWidth,
    height: win.outerHeight,
    left: win.screenX,
    top: win.screenY,
  };
}

// Creates a token that keeps callbacks from older navigator instances inert after a refresh.
function createNavigatorInstance(win: Window): { readonly isActive: () => boolean } {
  const instanceId =
    typeof globalThis.crypto?.randomUUID === "function"
      ? globalThis.crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`;
  const instanceWindow = win as Window & { [NAVIGATOR_INSTANCE_ID_KEY]?: string };
  instanceWindow[NAVIGATOR_INSTANCE_ID_KEY] = instanceId;

  return {
    isActive: () => !win.closed && instanceWindow[NAVIGATOR_INSTANCE_ID_KEY] === instanceId,
  };
}
