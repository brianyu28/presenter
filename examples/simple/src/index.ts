import { Presentation, Slide, Text } from "presenter";

document.addEventListener("DOMContentLoaded", () => {
  const slides = [new Slide([new Text("Hello", {})])];
  const presentation = new Presentation(
    "My Presentation",
    slides,
    document.body,
  );

  presentation.present();
});
