import type * as Three from "three";

export interface GLTFLoaderLike {
  load: (
    url: string,
    onLoad: (gltf: { scene: Three.Object3D }) => void,
    onProgress?: ((event: ProgressEvent) => void) | undefined,
    onError?: ((error: unknown) => void) | undefined,
  ) => void;
}

export interface ThreeModules {
  readonly THREE: typeof Three;
  readonly GLTFLoader: new () => GLTFLoaderLike;
}
