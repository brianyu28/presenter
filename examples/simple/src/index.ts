import { Presentation, Slide, Text } from "presenter";

const slide = new Slide([
  new Text("Welcome to Presenter.js!", {
    position: { x: 0.5, y: 0.5 },
    anchor: "center",
    fontSize: 150,
  }),
]);

document.addEventListener("DOMContentLoaded", () => {
  const presentation = new Presentation(
    "My Presentation",
    [slide],
    document.body,
  );

  presentation.present();
});
