import { Presentation } from "presenter";
import { toPng } from "html-to-image";

export async function renderPresentationAsImages(presentation: Presentation) {
  if (!presentation) {
    throw new Error("No presentation provided");
  }

  let slideIndex = 0;
  for (const slide of presentation.slides) {
    for (const animationIndex of slide.getKeyBuilds()) {
      slideIndex++;
      slide.render(presentation, animationIndex);
      await renderCurrentSlide(
        presentation,
        `${String(slideIndex).padStart(3, "0")}.png`,
      );
    }
  }
}

export async function renderCurrentSlide(
  presentation: Presentation,
  filename: string,
) {
  const dataUrl = await toPng(presentation.svg as unknown as HTMLElement, {
    canvasWidth: presentation.boundingBox.width / 2,
    canvasHeight: presentation.boundingBox.height / 2,
  });

  let link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
