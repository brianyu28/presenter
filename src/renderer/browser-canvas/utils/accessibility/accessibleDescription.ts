import type { Text } from "../../../../objects/Text";
import { ObjectType } from "../../../../types/ObjectType";
import { Slide } from "../../../../types/Slide";
import { SlideObject } from "../../../../types/SlideObject";
import { getTextUnitsFromTextContent } from "../../../../utils/objects/text/getTextUnitsFromTextContent";
import { getObjectChildren } from "../../../../utils/presentation/getObjectChildren";

export function createAccessibleDescriptionElement(presentationTitle: string): HTMLDivElement {
  const element = document.createElement("div");
  // Treat the element as a live region so that screen readers announce changes to its content
  element.setAttribute("role", "status");
  element.setAttribute("aria-label", presentationTitle);
  element.setAttribute("aria-atomic", "true");

  // Hide visually without removing the element from the accessibility tree
  Object.assign(element.style, {
    position: "absolute",
    width: "1px",
    height: "1px",
    overflow: "hidden",
    clipPath: "inset(50%)",
    whiteSpace: "nowrap",
  });

  return element;
}

export function getAccessibleDescription(
  slide: Slide,
  objectState: Map<SlideObject, SlideObject>,
): string {
  const descriptions = slide.description ? [slide.description] : [];

  function addObjectDescriptions(object: SlideObject, parentOpacity: number): void {
    const currentObject = objectState.get(object);
    if (currentObject === undefined) {
      return;
    }

    const effectiveOpacity = parentOpacity * currentObject.opacity;
    if (!isVisible(currentObject, effectiveOpacity)) {
      return;
    }

    const description = getObjectDescription(currentObject);
    if (description) {
      descriptions.push(description);
    }

    for (const childObject of getObjectChildren(object)) {
      addObjectDescriptions(childObject, effectiveOpacity);
    }
  }

  for (const object of slide.objects) {
    addObjectDescriptions(object, 1);
  }

  return descriptions.join("\n");
}

function isVisible(object: SlideObject, opacity: number): boolean {
  return opacity !== 0 && (!("drawn" in object) || object.drawn !== 0);
}

function getObjectDescription(object: SlideObject): string | null {
  if (object.description !== null) {
    return object.description;
  }
  return isTextObject(object) ? getTextDescription(object) : null;
}

function isTextObject(object: SlideObject): object is Text {
  return object.objectType === ObjectType.TEXT;
}

function getTextDescription(text: Text): string {
  let remainingLength = text.length;

  return getTextUnitsFromTextContent(text.text)
    .map((line) =>
      line
        .map((unit) => {
          if (remainingLength === null) {
            return unit.text;
          }
          if (remainingLength <= 0) {
            return "";
          }

          const visibleText = unit.text.slice(0, remainingLength);
          remainingLength -= visibleText.length;
          return visibleText;
        })
        .join(""),
    )
    .join("\n");
}

export function updateAccessibleDescription(element: HTMLElement, description: string): void {
  if (element.textContent !== description) {
    element.textContent = description;
  }
}
