import { Presentation } from "presenter";

document.addEventListener("DOMContentLoaded", () => {
  const presentation = new Presentation("My Presentation", document.body);
  presentation.present();
});
