import { Presentation } from "presenter";
import SimpleSlide from "./slides/simple";
import PositionsSlide from "./slides/positions";
import ShapesSlide from "./slides/shapes";
import BasicAnimationSlide from "./slides/basicAnimation";
import MorphSlide from "./slides/morph";

document.addEventListener("DOMContentLoaded", () => {
  const presentation = new Presentation(
    "My Presentation",
    [
      new SimpleSlide(),
      new PositionsSlide(),
      new ShapesSlide(),
      new BasicAnimationSlide(),
      new MorphSlide(),
    ],
    document.body,
  );

  presentation.present();
});
