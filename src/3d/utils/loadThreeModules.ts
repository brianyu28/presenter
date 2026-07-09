import { ThreeModules } from "../types/ThreeModules";

export async function loadThreeModules(): Promise<ThreeModules> {
  try {
    const [THREE, loaderModule] = await Promise.all([
      import("three"),
      import("three/examples/jsm/loaders/GLTFLoader.js"),
    ]);
    return { THREE, GLTFLoader: loaderModule.GLTFLoader };
  } catch (error) {
    throw new Error(
      'Presenter 3D rendering requires the "three" package. Install it with: npm install three',
      { cause: error },
    );
  }
}
