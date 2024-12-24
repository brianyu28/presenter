import { Presentation } from "./presentation";
import { Slide } from "./slide";
import { Text } from "../objects/text";

describe("Presentation keyboard commands", () => {
  test("Start and end commands exist", () => {
    const slide1 = new Slide([]);
    const slide2 = new Slide([]);
    const presentation = new Presentation(
      "Sample Presentation",
      [slide1, slide2],
      document.body,
    );
    expect(presentation.shortcuts["s"]).toMatchObject({
      slideIndex: 0,
      animationIndex: 0,
    });
    expect(presentation.shortcuts["e"]).toMatchObject({
      slideIndex: 1,
      animationIndex: 0,
    });
  });

  test("Slide index commands exist", () => {
    const slide1 = new Slide([]);
    const slide2 = new Slide([]);
    const presentation = new Presentation(
      "Sample Presentation",
      [slide1, slide2],
      document.body,
    );
    expect(presentation.shortcuts["1"]).toMatchObject({
      slideIndex: 0,
      animationIndex: 0,
    });
    expect(presentation.shortcuts["2"]).toMatchObject({
      slideIndex: 1,
      animationIndex: 0,
    });
  });

  test("Custom slide shortcuts exist", () => {
    const slide1 = new Slide([]);
    const text = new Text("Hello!");
    const slide2 = new Slide([text], [text.animate({ opacity: 0 })], {
      shortcuts: ["test1", ["test2", 1]],
    });
    const presentation = new Presentation(
      "Sample Presentation",
      [slide1, slide2],
      document.body,
    );
    expect(presentation.shortcuts["test1"]).toMatchObject({
      slideIndex: 1,
      animationIndex: 0,
    });
    expect(presentation.shortcuts["test2"]).toMatchObject({
      slideIndex: 1,
      animationIndex: 1,
    });
  });
});
