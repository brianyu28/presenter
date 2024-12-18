import { Presentation } from "presenter";
import SimpleSlide from "./slides/simple";
import PositionsSlide from "./slides/positions";
import ShapesSlide from "./slides/shapes";
import BasicAnimationSlide from "./slides/basicAnimation";

document.addEventListener("DOMContentLoaded", () => {
  const presentation = new Presentation(
    "My Presentation",
    [
      new SimpleSlide(),
      new PositionsSlide(),
      new ShapesSlide(),
      new BasicAnimationSlide(),
    ],
    document.body,
  );

  presentation.present();
});
