import { Presentation } from "../../types/Presentation";
import { ShortcutState } from "../../types/ShortcutState";
import { getPresentationShortcuts } from "./getPresentationShortcuts";

interface Callbacks {
  readonly onNext: (skipIntermediateBuilds: boolean) => void;
  readonly onPrevious: (skipIntermediateBuilds: boolean) => void;
  readonly onRenderSlide: (slideIndex: number | null, buildIndex: number) => void;
  readonly onShowNavigator: () => void;
}

export function setupKeyEventListeners(
  presentation: Presentation,
  element: HTMLElement,
  shortcutState: ShortcutState,
  { onNext, onPrevious, onRenderSlide, onShowNavigator }: Callbacks,
) {
  shortcutState.shortcuts = getPresentationShortcuts(presentation);

  element.addEventListener("keyup", (event) => {
    // Reset command
    if (event.code === "Escape") {
      shortcutState.textCommand = null;
      return;
    }

    // Next slide
    if (event.code === "ArrowRight" || event.code === "Space") {
      onNext(event.shiftKey);
      return;
    }

    // Previous slide
    if (event.code === "ArrowLeft") {
      onPrevious(event.shiftKey);
      return;
    }

    // Check for an active text command
    if (shortcutState.textCommand !== null) {
      // Submitting a text command
      if (event.code === "Enter") {
        const command = shortcutState.textCommand;
        shortcutState.textCommand = null;

        // Check for a valid shortcut
        const shortcutConfig = shortcutState.shortcuts[command];
        if (shortcutConfig !== undefined) {
          onRenderSlide(shortcutConfig.slideIndex, shortcutConfig.buildIndex);
        } else if (!isNaN(Number(command))) {
          // Fall back to numbered slide
          onRenderSlide(Number(command) - 1, 0);
        }

        return;
      } else if (event.code === "Backspace") {
        // Backspace to delete last character
        shortcutState.textCommand = shortcutState.textCommand.slice(0, -1);
      } else {
        // Add character to text command
        shortcutState.textCommand += event.key;
      }
      return;
    }

    // Start a new text command
    if (event.key === "g") {
      shortcutState.textCommand = "";
      return;
    }

    // Show navigator
    if (event.key === "`") {
      onShowNavigator();
      return;
    }
  });
}
