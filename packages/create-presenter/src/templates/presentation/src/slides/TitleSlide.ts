import { Anchor, Slide, Text } from "presenter";
import { position } from "../size";

const title = Text("Welcome to Presenter.js!", {
  anchor: Anchor.CENTER,
  fontSize: 150,
  ...position(0.5, 0.5),
});

export const TitleSlide = Slide({
  objects: [title],
});
