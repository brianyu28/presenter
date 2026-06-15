import { Presentation } from "../../types/Presentation";
import { ShortcutState } from "../../types/ShortcutState";
import { hasModifierKey } from "../dom/hasModifierKey";
import { isInteractiveElement } from "../dom/isInteractiveElement";
import { getPresentationShortcuts } from "./getPresentationShortcuts";
import { resolvePresentationShortcutCommand } from "./resolvePresentationShortcutCommand";

interface Callbacks {
  readonly onNext: (skipIntermediateBuilds: boolean) => void;
  readonly onPrevious: (skipIntermediateBuilds: boolean) => void;
  readonly onRenderSlide: (slideIndex: number | null, buildIndex: number) => void;
  readonly onShowNavigator: () => void;
}

interface Options {
  // For non-full-screen presentations, click should focus the presentation to accept keyboard events
  readonly focusOnPointerDown?: boolean;
  readonly keyEventTarget?: HTMLElement | Window;
  // Allows callers to remove all listeners created by this setup call at once.
  readonly signal?: AbortSignal;
}

export function setupKeyEventListeners(
  presentation: Presentation,
  element: HTMLElement,
  shortcutState: ShortcutState,
  { onNext, onPrevious, onRenderSlide, onShowNavigator }: Callbacks,
  { focusOnPointerDown = false, keyEventTarget = element, signal }: Options = {},
) {
  shortcutState.shortcuts = getPresentationShortcuts(presentation);
  const listenerOptions = signal === undefined ? undefined : { signal };

  if (focusOnPointerDown) {
    if (!element.hasAttribute("tabindex")) {
      element.tabIndex = -1;
    }
    element.addEventListener(
      "pointerdown",
      (event) => {
        if (isInteractiveElement(event.target)) {
          return;
        }

        element.focus({ preventScroll: true });
      },
      listenerOptions,
    );
  }

  // Show cursor when mouse moves
  element.addEventListener(
    "mousemove",
    () => {
      element.style.cursor = "auto";
    },
    listenerOptions,
  );

  keyEventTarget.addEventListener(
    "keyup",
    (event) => {
      const keyEvent = event as KeyboardEvent;
      if (isInteractiveElement(keyEvent.target)) {
        return;
      }

      // Reset command
      if (keyEvent.code === "Escape") {
        shortcutState.textCommand = null;
        return;
      }

      // Next slide
      if (keyEvent.code === "ArrowRight" || keyEvent.code === "Space") {
        onNext(keyEvent.shiftKey);
        return;
      }

      // Previous slide
      if (keyEvent.code === "ArrowLeft") {
        onPrevious(keyEvent.shiftKey);
        return;
      }

      const altCommand = getAltShortcutCommand(keyEvent);
      if (altCommand !== null) {
        const shortcutConfig = resolvePresentationShortcutCommand(
          shortcutState.shortcuts,
          altCommand,
        );
        shortcutState.textCommand = null;

        if (shortcutConfig !== null) {
          keyEvent.preventDefault();
          onRenderSlide(shortcutConfig.slideIndex, shortcutConfig.buildIndex);
        }

        return;
      }

      // Check for an active text command
      if (shortcutState.textCommand !== null) {
        // Submitting a text command
        if (keyEvent.code === "Enter") {
          const command = shortcutState.textCommand;
          shortcutState.textCommand = null;

          const shortcutConfig = resolvePresentationShortcutCommand(
            shortcutState.shortcuts,
            command,
          );
          if (shortcutConfig !== null) {
            onRenderSlide(shortcutConfig.slideIndex, shortcutConfig.buildIndex);
          }

          return;
        } else if (keyEvent.code === "Backspace") {
          // Backspace to delete last character
          shortcutState.textCommand = shortcutState.textCommand.slice(0, -1);
        } else {
          // Add character to text command
          shortcutState.textCommand += keyEvent.key;
        }
        return;
      }

      // Start a new text command
      if (keyEvent.key === "g") {
        shortcutState.textCommand = "";
        return;
      }

      // Show navigator
      if (keyEvent.key === "`" && !hasModifierKey(keyEvent)) {
        onShowNavigator();
        return;
      }
    },
    listenerOptions,
  );
}

function getAltShortcutCommand(keyEvent: KeyboardEvent): string | null {
  if (!keyEvent.altKey || keyEvent.ctrlKey || keyEvent.metaKey || keyEvent.shiftKey) {
    return null;
  }

  if (keyEvent.code.startsWith("Key") && keyEvent.code.length === 4) {
    return keyEvent.code.slice(3).toLowerCase();
  }

  if (keyEvent.code.startsWith("Digit") && keyEvent.code.length === 6) {
    return keyEvent.code.slice(5);
  }

  if (keyEvent.code.startsWith("Numpad") && keyEvent.code.length === 7) {
    return keyEvent.code.slice(6);
  }

  return null;
}
