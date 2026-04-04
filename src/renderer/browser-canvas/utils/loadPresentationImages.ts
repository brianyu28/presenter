import { ImageType, UnifiedImage } from "../types/UnifiedImage";

export async function loadPresentationImages(
  imagePathById: Record<string, string>,
): Promise<Record<string, UnifiedImage>> {
  if (Object.keys(imagePathById).length === 0) {
    return {};
  }

  const imageById: Record<string, UnifiedImage> = {};

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);

      // Handle SVGs that aren't already in URL form
      const isRawSVG = src.includes("</svg>");
      if (isRawSVG) {
        // Remove XML header tag, can cause parsing to fail and isn't necessary for SVG rendering
        const sanitized = src.replace(/<\?xml[^?]*\?>\s*/g, "");

        const svgBlob = new Blob([sanitized], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);
        img.src = url;
      } else {
        img.src = src;
      }
    });
  };

  const loadPromises = Object.entries(imagePathById).map(async ([id, path]) => {
    const img = await loadImage(path);
    imageById[id] = {
      type: ImageType.Browser,
      image: img,
    };
  });

  try {
    await Promise.all(loadPromises);
  } catch (error) {
    console.error("Error loading images:", error);
  }

  return imageById;
}
