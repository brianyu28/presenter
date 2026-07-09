import { Rectangle } from "../../objects/Rectangle";
import { Animate } from "../../types/Animate";
import { Pause } from "../../types/Pause";
import { Presentation } from "../../types/Presentation";
import { Slide } from "../../types/Slide";
import { getImageExportFrames } from "./getImageExportFrames";

describe("getImageExportFrames", () => {
  it("returns key builds for non-animated exports", () => {
    const presentation = Presentation({
      slides: [
        Slide({
          isStartKey: true,
          animations: [Pause(100, { isKey: true }), Pause(100)],
        }),
        Slide(),
      ],
    });

    expect([
      ...getImageExportFrames({
        presentation,
        isAnimatedExport: false,
        animationHoldFrames: 1,
        framesPerSecond: 30,
      }),
    ]).toEqual([
      { imageIndex: 0, slideIndex: 0, buildIndex: 0, buildTime: null },
      { imageIndex: 1, slideIndex: 0, buildIndex: 1, buildTime: null },
      { imageIndex: 2, slideIndex: 0, buildIndex: 2, buildTime: null },
      { imageIndex: 3, slideIndex: 1, buildIndex: 0, buildTime: null },
    ]);
  });

  it("returns holds and animation frames for animated exports", () => {
    const rectangle = Rectangle();
    const presentation = Presentation({
      slides: [
        Slide({
          objects: [rectangle],
          animations: [Animate(rectangle, { x: 100 }, 1000)],
        }),
      ],
    });

    expect([
      ...getImageExportFrames({
        presentation,
        isAnimatedExport: true,
        animationHoldFrames: 2,
        framesPerSecond: 2,
      }),
    ]).toEqual([
      { imageIndex: 0, slideIndex: 0, buildIndex: 0, buildTime: null },
      { imageIndex: 1, slideIndex: 0, buildIndex: 0, buildTime: null },
      { imageIndex: 2, slideIndex: 0, buildIndex: 1, buildTime: 0 },
      { imageIndex: 3, slideIndex: 0, buildIndex: 1, buildTime: 500 },
      { imageIndex: 4, slideIndex: 0, buildIndex: 1, buildTime: null },
      { imageIndex: 5, slideIndex: 0, buildIndex: 1, buildTime: null },
    ]);
  });
});
