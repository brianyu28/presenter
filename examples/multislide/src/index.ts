import { Presentation } from "presenter";
import SimpleSlide from "./slides/simple";
import PositionsSlide from "./slides/positions";
import ShapesSlide from "./slides/shapes";
import BasicAnimationSlide from "./slides/basicAnimation";
import MorphSlide from "./slides/morph";
import ThreeDimensionalSlide from "./slides/threeDimensional";
import LatexSlide from "./slides/latex";

document.addEventListener("DOMContentLoaded", () => {
  const presentation = new Presentation(
    "My Presentation",
    [
      new SimpleSlide(),
      new PositionsSlide(),
      new ShapesSlide(),
      new BasicAnimationSlide(),
      new MorphSlide(),
      new ThreeDimensionalSlide(),
      new LatexSlide(),
    ],
    document.body,
  );

  presentation.present();
});
