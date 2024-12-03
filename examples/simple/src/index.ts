import { Presentation, Slide, Text } from "presenter";

document.addEventListener("DOMContentLoaded", () => {
  const slides = [
    new Slide([
      new Text({
        content: "Hello, there!",
        position: { x: 2000, y: 1000 },
        fontSize: 100,
      }),
    ]),
  ];
  const presentation = new Presentation(
    "My Presentation",
    slides,
    document.body,
  );

  presentation.present();
});
