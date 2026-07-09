import type { Object3D } from "three";

import { Presentation } from "../../types/Presentation";
import { SlideObject } from "../../types/SlideObject";
import { getObjectChildren } from "../../utils/presentation/getObjectChildren";
import { ThreeModel } from "../objects/ThreeModel";
import { ThreeObjectType } from "../objects/ThreeObjectType";
import { GLTFLoaderLike } from "../types/ThreeModules";
import { inspectThreeModelScene, logThreeModelInspection } from "./modelInspection";

interface LoadedModel {
  readonly status: "loaded";
  readonly scene: Object3D;
}

interface LoadingModel {
  readonly status: "loading";
  readonly promise: Promise<void>;
}

type ModelState = LoadedModel | LoadingModel;

interface ModelPreloadRequest {
  readonly src: string;
  readonly debugNames: boolean;
}

/**
 * Cache GLB/GLTF load state by source URL for the lifetime of the browser session.
 *
 * `getThreeObjectRenderers(presentation)` preloads every model before presentation rendering
 * starts. This cache deduplicates repeated model references across slides, lets multiple preload
 * calls share in-flight work during hot module replacement, and keeps already-parsed Three.js
 * scenes available when the renderer is recreated in the same JS session.
 */
const modelStateBySrc = new Map<string, ModelState>();
const loggedInspectionBySrc = new Set<string>();

export async function preloadThreeModels(
  loader: GLTFLoaderLike,
  presentation: Presentation,
): Promise<void> {
  const modelRequests = new Map<string, ModelPreloadRequest>();

  for (const slide of presentation.slides) {
    for (const object of slide.objects) {
      collectModelSources(object, modelRequests);
    }
  }

  await Promise.all(
    [...modelRequests.values()].map(async (request) => {
      try {
        await loadThreeModel(loader, request.src);
        if (request.debugNames) {
          logLoadedModelInspection(request.src);
        }
      } catch (error) {
        throw new Error(`Failed to load 3D model: ${request.src}`, { cause: error });
      }
    }),
  );
}

export function getLoadedModelScene(src: string): Object3D | null {
  const state = modelStateBySrc.get(src);
  return state?.status === "loaded" ? state.scene : null;
}

export function loadThreeModel(loader: GLTFLoaderLike, src: string): Promise<void> {
  return loadModel(loader, src);
}

function collectModelSources(object: SlideObject, sources: Map<string, ModelPreloadRequest>): void {
  if (object.objectType === ThreeObjectType.MODEL) {
    const model = object as ThreeModel;
    if (model.src !== "") {
      const existingRequest = sources.get(model.src);
      sources.set(model.src, {
        src: model.src,
        debugNames: model.debugNames || existingRequest?.debugNames === true,
      });
    }
  }

  for (const childObject of getObjectChildren(object)) {
    collectModelSources(childObject, sources);
  }
}

function logLoadedModelInspection(src: string): void {
  if (loggedInspectionBySrc.has(src)) {
    return;
  }

  const scene = getLoadedModelScene(src);
  if (scene === null) {
    return;
  }

  loggedInspectionBySrc.add(src);
  logThreeModelInspection(inspectThreeModelScene(src, scene));
}

function loadModel(loader: GLTFLoaderLike, src: string): Promise<void> {
  const existingState = modelStateBySrc.get(src);
  if (existingState?.status === "loaded") {
    return Promise.resolve();
  }
  if (existingState?.status === "loading") {
    return existingState.promise;
  }

  const promise = new Promise<void>((resolve, reject) => {
    loader.load(
      src,
      (gltf) => {
        modelStateBySrc.set(src, { status: "loaded", scene: gltf.scene });
        resolve();
      },
      undefined,
      (error: unknown) => {
        modelStateBySrc.delete(src);
        reject(error);
      },
    );
  });

  modelStateBySrc.set(src, { status: "loading", promise });
  return promise;
}
