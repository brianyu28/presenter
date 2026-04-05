import { BrowserCanvasRenderer } from "presenter";
import { presentation } from "./presentation";

document.addEventListener("DOMContentLoaded", () => {
  const renderer = new BrowserCanvasRenderer({
    presentation,
  });
  renderer.present();
});
