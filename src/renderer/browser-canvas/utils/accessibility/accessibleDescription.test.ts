import { Group } from "../../../../objects/Group";
import { Line } from "../../../../objects/Line";
import { Rectangle } from "../../../../objects/Rectangle";
import { Text } from "../../../../objects/Text";
import { Animate } from "../../../../types/Animate";
import { Slide } from "../../../../types/Slide";
import { SlideObject } from "../../../../types/SlideObject";
import { getObjectState } from "../../../../utils/presentation/getObjectState";
import {
  createAccessibleDescriptionElement,
  getAccessibleDescription,
  updateAccessibleDescription,
} from "./accessibleDescription";

describe("accessibleDescription", () => {
  test("creates a visually hidden status region", () => {
    const element = createAccessibleDescriptionElement("Demo presentation");

    expect(element.getAttribute("role")).toBe("status");
    expect(element.getAttribute("aria-label")).toBe("Demo presentation");
    expect(element.getAttribute("aria-atomic")).toBe("true");
    expect(element.style.position).toBe("absolute");
    expect(element.style.width).toBe("1px");
    expect(element.style.height).toBe("1px");
    expect(element.style.overflow).toBe("hidden");
  });

  test("includes the slide and visible objects in object order", () => {
    const visible = Rectangle({ description: "Visible rectangle" });
    const hiddenByOpacity = Rectangle({
      description: "Transparent rectangle",
      opacity: 0,
    });
    const hiddenByDrawn = Line({
      description: "Undrawn line",
      drawn: 0,
    });
    const hiddenChild = Rectangle({ description: "Child of transparent group" });
    const transparentGroup = Group([hiddenChild], {
      description: "Transparent group",
      opacity: 0,
    });
    const visibleChild = Rectangle({ description: "Visible child" });
    const visibleGroup = Group([visibleChild], { description: "Visible group" });
    const slide = Slide({
      description: "Slide overview",
      objects: [visible, hiddenByOpacity, hiddenByDrawn, transparentGroup, visibleGroup],
    });

    expect(
      getAccessibleDescription(slide, getObjectState({ slide, buildIndex: 0, buildTime: null })),
    ).toBe("Slide overview\nVisible rectangle\nVisible group\nVisible child");
  });

  test("defaults slide and object descriptions to null", () => {
    expect(Slide().description).toBeNull();
    expect(SlideObject({}).description).toBeNull();
    expect(Slide({ description: "" }).description).toBe("");
    expect(SlideObject({ description: "" }).description).toBe("");
  });

  test("uses animated descriptions and visibility", () => {
    const object = Rectangle({ description: "Before animation" });
    const slide = Slide({
      description: "Slide overview",
      objects: [object],
      animations: [Animate(object, { description: "After animation" })],
    });

    expect(
      getAccessibleDescription(slide, getObjectState({ slide, buildIndex: 0, buildTime: null })),
    ).toBe("Slide overview\nBefore animation");
    expect(
      getAccessibleDescription(slide, getObjectState({ slide, buildIndex: 1, buildTime: null })),
    ).toBe("Slide overview\nAfter animation");
  });

  test("derives descriptions from visible Text content", () => {
    const derived = Text([["First ", { text: "line" }], [{ text: "Second line" }]]);
    const partiallyWritten = Text("Hello world", { length: 5 });
    const explicit = Text("Ignored text", { description: "Explicit description" });
    const suppressed = Text("Ignored text", { description: "" });
    const slide = Slide({
      objects: [derived, partiallyWritten, explicit, suppressed],
    });

    expect(
      getAccessibleDescription(slide, getObjectState({ slide, buildIndex: 0, buildTime: null })),
    ).toBe("First line\nSecond line\nHello\nExplicit description");
  });

  test("only updates the live region when its descriptions change", () => {
    const element = createAccessibleDescriptionElement("Demo presentation");
    updateAccessibleDescription(element, "Slide overview\nVisible object");
    const originalTextNode = element.firstChild;

    updateAccessibleDescription(element, "Slide overview\nVisible object");
    expect(element.firstChild).toBe(originalTextNode);

    updateAccessibleDescription(element, "Updated overview");
    expect(element.textContent).toBe("Updated overview");
    expect(element.firstChild).not.toBe(originalTextNode);
  });
});
