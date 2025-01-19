import jsPDF from "jspdf";
import "svg2pdf.js";
import { Presentation } from "../presentation/presentation";
import { toPng } from "html-to-image";
import { blobToBase64 } from "./util";

/**
 * Renders the SVG content of a single slide of a presentation to a PNG image.
 */
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

/**
 * Renders the SVG content of all slides in a presentation as PNG images.
 */
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

/**
 * Renders whole slide container (background, additional element canvas, svg)
 * and sends to a server endpoint.
 *
 * When rendering all componenst of the slide container, the server endpoint
 * is requried to perform additional image compositing to generate the
 * render.
 */
export async function exportCurrentSlideContainer(
  presentation: Presentation,
  filename: string,
  serverEndpoint: string,
) {
  const { width, height } = presentation.boundingBox;
  const backgroundDataUrl = await toPng(
    presentation.background as unknown as HTMLElement,
    {
      canvasWidth: width / 2,
      canvasHeight: height / 2,
    },
  );
  const canvasElement =
    presentation.additionalElementContainer.querySelector("canvas");
  const canvasDataUrl = canvasElement ? canvasElement.toDataURL() : null;
  const svgDataUrl = await toPng(presentation.svg as unknown as HTMLElement, {
    canvasWidth: width / 2,
    canvasHeight: height / 2,
  });
  await fetch(`${serverEndpoint}/export`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filename,
      backgroundDataUrl,
      canvasDataUrl,
      svgDataUrl,
    }),
  });
}

/**
 * Exports the whole slide content of all slides and sends to a server endpoint.
 */
export async function exportAllSlides(
  presentation: Presentation,
  serverEndpoint: string,
) {
  if (!presentation) {
    throw new Error("No presentation provided");
  }

  let slideIndex = 0;
  for (const slide of presentation.slides) {
    for (const animationIndex of slide.getKeyBuilds()) {
      slideIndex++;
      slide.render(presentation, animationIndex);
      await exportCurrentSlideContainer(
        presentation,
        `${String(slideIndex).padStart(3, "0")}.png`,
        serverEndpoint,
      );
    }
  }

  // Process export as PDF
  await fetch(`${serverEndpoint}/generate-pdf`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filename: `${presentation.title}.pdf`,
      images: Array(slideIndex)
        .fill(null)
        .map((_, i) => `${String(i + 1).padStart(3, "0")}.png`),
    }),
  });
}

export async function exportToPDF(
  presentation: Presentation,
  promptForConfirmation: boolean = false,
) {
  if (promptForConfirmation) {
    if (!confirm("Download slides as PDF?")) {
      return;
    }
  }

  const { width, height } = presentation.options;

  // Create new PDF document.
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [width, height],
    hotfixes: ["px_scaling"],
  });

  // Load any fonts needed for the presentation.
  for (let font of presentation.options.fonts) {
    const res = await fetch(font.url);
    const fontBase64 = (await blobToBase64(await res.blob())).split(",")[1];

    const fontFamily = font.fontFamily;
    const fontStyle = font.fontStyle ?? "normal";
    const fontWeight = font.fontWeight ?? "normal";

    // Arbitrary but unique filename to represent the font
    const filename = `${fontFamily}-${fontStyle}-${fontWeight}.ttf`;

    doc.addFileToVFS(filename, fontBase64);
    doc.addFont(filename, fontFamily, fontStyle, fontWeight);
  }

  let firstPage = true;
  let slideIndex = 0;
  for (const slide of presentation.slides) {
    for (const animationIndex of slide.getKeyBuilds()) {
      slideIndex++;
      slide.render(presentation, animationIndex);

      // Remove any SVG elements with opacity 0.
      // svg2pdf.js doesn't know how to appropriately handle them.
      const invisibleSVGs = presentation.svg.querySelectorAll("svg");
      invisibleSVGs.forEach((invisibleSVG) => {
        if (invisibleSVG.style.opacity === "0") {
          invisibleSVG.remove();
        }
      });

      // If it's not the first slide, add a new page.
      if (!firstPage) {
        doc.addPage([width, height], "landscape");
      } else {
        firstPage = false;
      }

      // Add background color.
      doc.setFillColor(presentation.options.backgroundColor);
      doc.rect(0, 0, width, height, "F");

      // Add SVG content.
      await doc.svg(presentation.svg, {
        x: 0,
        y: 0,
        width,
        height,
      });
    }
  }

  doc.save(`${presentation.title}.pdf`);
}
