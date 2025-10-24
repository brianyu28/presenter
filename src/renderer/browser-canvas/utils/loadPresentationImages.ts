export async function loadPresentationImages(
  imagePathById: Record<string, string>,
): Promise<Record<string, HTMLImageElement>> {
  if (Object.keys(imagePathById).length === 0) {
    return {};
  }

  const imageById: Record<string, HTMLImageElement> = {};

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);

      const isSVG = src.includes("</svg>");
      if (isSVG) {
        const svgBlob = new Blob([src], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);
        img.src = url;
      } else {
        img.src = src;
      }
    });
  };

  const loadPromises = Object.entries(imagePathById).map(async ([id, path]) => {
    const img = await loadImage(path);
    imageById[id] = img;
  });

  await Promise.all(loadPromises);
  return imageById;
}
