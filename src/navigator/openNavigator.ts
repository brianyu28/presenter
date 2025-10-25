import { Presentation } from "../types/Presentation";
import { Slide } from "../types/Slide";

let navigatorWindow: Window | null = null;

interface Args {
  readonly presentation: Presentation;
  readonly onNavigateToSlide: (slideIndex: number) => void;
}

export function openNavigator({ presentation, onNavigateToSlide }: Args) {
  if (navigatorWindow !== null && !navigatorWindow.closed) {
    navigatorWindow.focus();
    return;
  }

  navigatorWindow = window.open("", "Navigator", "width=300,height=500,left=20,top=50");
  if (navigatorWindow === null) {
    console.error("Failed to open navigator window.");
    return;
  }

  const navigatorElement = createNavigatorElement(presentation, onNavigateToSlide);

  navigatorWindow.document.title = presentation.title;
  navigatorWindow.document.body.appendChild(navigatorElement);

  navigatorWindow.addEventListener("keyup", (event) => {
    if (event.key === "Escape" || event.key === "`") {
      navigatorWindow?.close();
      navigatorWindow = null;
    }
  });
}

export function createNavigatorElement(
  presentation: Presentation,
  onNavigateToSlide: (slideIndex: number) => void,
): HTMLDivElement {
  const navigatorElement = document.createElement("div");
  navigatorElement.style.fontFamily = "Arial, sans-serif";

  presentation.slides.forEach((slide, index) => {
    const slideElement = createSlideElement(slide, index);
    slideElement.style.cursor = "pointer";
    slideElement.addEventListener("click", (event) => {
      // If shift key is pressed, close window
      if (event.shiftKey) {
        navigatorWindow?.close();
      }
      onNavigateToSlide(index);
    });
    navigatorElement.appendChild(slideElement);
  });

  return navigatorElement;
}

function createSlideElement(slide: Slide, slideIndex: number): HTMLDivElement {
  const slideElement = document.createElement("div");
  slideElement.style.marginBottom = "8px";
  slideElement.style.padding = "8px";
  slideElement.style.backgroundColor = "#eceed7";
  slideElement.style.borderRadius = "4px";
  slideElement.style.userSelect = "none";

  slideElement.innerHTML =
    `${slideIndex + 1}: ` + (slide.title.length > 0 ? slide.title : `Slide ${slideIndex + 1}`);

  return slideElement;
}
