import path from "path";

export function getImagePathById(
  relativeImagePathById: Record<string, string>,
  pathPrefix: string,
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [id, relativePath] of Object.entries(relativeImagePathById)) {
    result[id] = path.join(pathPrefix, relativePath);
  }
  return result;
}
