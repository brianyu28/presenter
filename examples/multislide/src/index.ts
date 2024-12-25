import { Presentation } from "presenter";
import SimpleSlide from "./slides/simple";
import PositionsSlide from "./slides/positions";
import ShapesSlide from "./slides/shapes";
import BasicAnimationSlide from "./slides/basicAnimation";
import MorphSlide from "./slides/morph";
import ThreeDimensionalSlide from "./slides/threeDimensional";
import LatexSlide from "./slides/latex";
import RichTextSlide from "./slides/richText";
import ShortcutsSlide from "./slides/shortcuts";
import GroupSlide from "./slides/group";

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
      new RichTextSlide(),
      new ShortcutsSlide(),
      new GroupSlide(),
    ],
    document.body,
  );

  presentation.present();
});
