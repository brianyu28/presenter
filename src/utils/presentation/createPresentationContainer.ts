import { Presentation } from "../../types/Presentation";
import { isFullBodyPresentation } from "./isFullBodyPresentation";

export function createPresentationContainer(
  presentation: Presentation,
  root: HTMLElement,
): HTMLDivElement {
  const container = document.createElement("div");
  container.style.width = "100%";
  container.style.aspectRatio = `${presentation.size.width} / ${presentation.size.height}`;

  // Set container to be vertically centered.
  container.style.position = "relative";
  container.style.top = "50%";
  container.style.transform = "translateY(-50%)";

  // Set container to be horizontally centered.
  container.style.marginLeft = "auto";
  container.style.marginRight = "auto";

  if (isFullBodyPresentation(root)) {
    // Set document title to title of presentation.
    document.title = presentation.title;

    // Set root element styles.
    document.documentElement.style.height = "100%";

    // Set body styles.
    document.body.style.margin = "0";
    document.body.style.height = "100%";
    document.body.style.width = "100%";
    document.body.style.backgroundColor = "#000000";

    // Ensure style properties change to maintain aspect ratio fit.
    const targetAspectRatio = presentation.size.height / presentation.size.width;
    updateContainerSize(container, targetAspectRatio);

    window
      .matchMedia(`(min-aspect-ratio: ${presentation.size.width} / ${presentation.size.height})`)
      .addEventListener("change", () => updateContainerSize(container, targetAspectRatio));
  }

  return container;
}

function updateContainerSize(container: HTMLElement, targetAspectRatio: number) {
  if (window.innerHeight / window.innerWidth > targetAspectRatio) {
    container.style.width = "100%";
    container.style.height = "auto";
  } else {
    container.style.width = "auto";
    container.style.height = "100%";
  }
}
