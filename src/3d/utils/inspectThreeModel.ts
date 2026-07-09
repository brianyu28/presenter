import { GLTFLoaderLike } from "../types/ThreeModules";
import { loadThreeModules } from "./loadThreeModules";
import { getLoadedModelScene, loadThreeModel } from "./modelCache";
import {
  inspectThreeModelScene,
  logThreeModelInspection,
  type ThreeModelInspection,
  type ThreeModelMaterialInfo,
  type ThreeModelNodeInfo,
} from "./modelInspection";

export type { ThreeModelInspection, ThreeModelMaterialInfo, ThreeModelNodeInfo };

export async function inspectThreeModel(src: string): Promise<ThreeModelInspection> {
  const modules = await loadThreeModules();
  const loader: GLTFLoaderLike = new modules.GLTFLoader();
  await loadThreeModel(loader, src);

  const scene = getLoadedModelScene(src);
  if (scene === null) {
    throw new Error(`3D model was not loaded: ${src}`);
  }

  return inspectThreeModelScene(src, scene);
}

export async function logThreeModelParts(src: string): Promise<ThreeModelInspection> {
  const inspection = await inspectThreeModel(src);
  logThreeModelInspection(inspection);
  return inspection;
}
