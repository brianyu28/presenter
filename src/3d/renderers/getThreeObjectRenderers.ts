import type * as Three from "three";

import { BrowserCanvasObjectRenderer } from "../../renderer/browser-canvas/types/BrowserCanvasObjectRenderer";
import { CanvasContextType } from "../../renderer/browser-canvas/types/UnifiedCanvasContext";
import { Color } from "../../types/Color";
import { Position } from "../../types/Position";
import { Presentation } from "../../types/Presentation";
import { Size } from "../../types/Size";
import { SlideObject } from "../../types/SlideObject";
import { getAlphaForColor } from "../../utils/color/getAlphaForColor";
import { getBoundingBox } from "../../utils/layout/getBoundingBox";
import { ThreeBox } from "../objects/ThreeBox";
import { ThreeCameraType } from "../objects/ThreeCameraType";
import { ThreeMesh } from "../objects/ThreeMesh";
import { ThreeModel } from "../objects/ThreeModel";
import { ThreeModelMaterial } from "../objects/ThreeModelMaterial";
import { ThreeModelNode } from "../objects/ThreeModelNode";
import { ThreeModelTarget } from "../objects/ThreeModelTarget";
import { ThreeObjectType } from "../objects/ThreeObjectType";
import { ThreeScene } from "../objects/ThreeScene";
import { ThreeSphere } from "../objects/ThreeSphere";
import { GLTFLoaderLike, ThreeModules } from "../types/ThreeModules";
import { colorToThreeHex } from "../utils/colorToThreeHex";
import { loadThreeModules } from "../utils/loadThreeModules";
import { getLoadedModelScene, preloadThreeModels } from "../utils/modelCache";
import {
  collectObjectPaths,
  getPresenterId,
  modelTargetToString,
  objectPathMatches,
} from "../utils/modelPaths";

interface Runtime {
  readonly renderer: Three.WebGLRenderer;
  readonly scene: Three.Scene;
  camera: Three.PerspectiveCamera | Three.OrthographicCamera;
  cameraType: ThreeCameraType;
  readonly target: Three.Vector3;
}

const runtimeByScene = new WeakMap<SlideObject, Runtime>();
const loggedTargetWarningKeys = new Set<string>();

export async function getThreeObjectRenderers(
  presentation: Presentation,
): Promise<Record<string, BrowserCanvasObjectRenderer<SlideObject>>> {
  const modules = await loadThreeModules();
  const loader: GLTFLoaderLike = new modules.GLTFLoader();
  await preloadThreeModels(loader, presentation);

  return {
    [ThreeObjectType.SCENE]: createRenderThreeScene(
      modules,
    ) as BrowserCanvasObjectRenderer<SlideObject>,
  };
}

function createRenderThreeScene({ THREE }: ThreeModules): BrowserCanvasObjectRenderer<ThreeScene> {
  return (args) => {
    const { ctx, object: sceneObject, opacity, originalObject, getCurrentObject } = args;

    if (ctx.type !== CanvasContextType.Browser) {
      return;
    }

    const targetOpacity = opacity * sceneObject.opacity;
    if (targetOpacity === 0 || sceneObject.width <= 0 || sceneObject.height <= 0) {
      return;
    }

    const runtime = getRuntime(THREE, sceneObject, originalObject);
    runtime.renderer.setPixelRatio(window.devicePixelRatio || 1);
    runtime.renderer.setSize(sceneObject.width, sceneObject.height, false);

    clearScene(runtime.scene);
    configureScene(THREE, runtime, sceneObject);

    const originalScene =
      originalObject.objectType === ThreeObjectType.SCENE
        ? (originalObject as ThreeScene)
        : sceneObject;

    for (const originalMesh of originalScene.meshes) {
      const currentMesh = getCurrentObject(originalMesh) as ThreeMesh | undefined;
      if (currentMesh === undefined || currentMesh.opacity === 0) {
        continue;
      }
      const object3d = createObject3D(THREE, currentMesh, originalMesh, getCurrentObject);
      if (object3d !== null) {
        applyMeshTransform(object3d, currentMesh);
        runtime.scene.add(object3d);
      }
    }

    configureCamera(THREE, runtime, sceneObject);
    runtime.camera.position.set(sceneObject.cameraX, sceneObject.cameraY, sceneObject.cameraZ);
    runtime.target.set(sceneObject.targetX, sceneObject.targetY, sceneObject.targetZ);
    runtime.camera.lookAt(runtime.target);
    runtime.camera.updateProjectionMatrix();

    runtime.renderer.render(runtime.scene, runtime.camera);

    const boundingBox = getBoundingBox(
      Position({ x: sceneObject.x, y: sceneObject.y }),
      sceneObject.anchor,
      Size({ width: sceneObject.width, height: sceneObject.height }),
    );

    ctx.context.save();
    ctx.context.globalAlpha = targetOpacity;
    ctx.context.drawImage(
      runtime.renderer.domElement,
      boundingBox.origin.x,
      boundingBox.origin.y,
      boundingBox.size.width,
      boundingBox.size.height,
    );
    ctx.context.restore();
  };
}

function getRuntime(
  THREE: typeof Three,
  sceneObject: ThreeScene,
  originalObject: SlideObject,
): Runtime {
  const runtimeKey =
    originalObject.objectType === ThreeObjectType.SCENE ? originalObject : sceneObject;
  const existingRuntime = runtimeByScene.get(runtimeKey);
  if (existingRuntime !== undefined) {
    return existingRuntime;
  }

  const canvas = document.createElement("canvas");
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas,
    preserveDrawingBuffer: true,
  });
  const runtime: Runtime = {
    renderer,
    scene: new THREE.Scene(),
    camera: createCamera(THREE, sceneObject),
    cameraType: sceneObject.cameraType,
    target: new THREE.Vector3(),
  };
  runtimeByScene.set(runtimeKey, runtime);
  return runtime;
}

function configureCamera(THREE: typeof Three, runtime: Runtime, sceneObject: ThreeScene): void {
  if (runtime.cameraType !== sceneObject.cameraType) {
    runtime.camera = createCamera(THREE, sceneObject);
    runtime.cameraType = sceneObject.cameraType;
  }

  switch (sceneObject.cameraType) {
    case ThreeCameraType.PERSPECTIVE: {
      const camera = runtime.camera as Three.PerspectiveCamera;
      camera.aspect = sceneObject.width / sceneObject.height;
      camera.fov = sceneObject.cameraFov;
      camera.near = sceneObject.cameraNear;
      camera.far = sceneObject.cameraFar;
      break;
    }
    case ThreeCameraType.ORTHOGRAPHIC: {
      const camera = runtime.camera as Three.OrthographicCamera;
      const height = getOrthographicHeight(sceneObject);
      const width = height * (sceneObject.width / sceneObject.height);
      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.near = sceneObject.cameraNear;
      camera.far = sceneObject.cameraFar;
      break;
    }
  }
}

function createCamera(
  THREE: typeof Three,
  sceneObject: ThreeScene,
): Three.PerspectiveCamera | Three.OrthographicCamera {
  switch (sceneObject.cameraType) {
    case ThreeCameraType.PERSPECTIVE:
      return new THREE.PerspectiveCamera(
        sceneObject.cameraFov,
        sceneObject.width / sceneObject.height,
        sceneObject.cameraNear,
        sceneObject.cameraFar,
      );
    case ThreeCameraType.ORTHOGRAPHIC:
      return createOrthographicCamera(THREE, sceneObject);
  }
}

function createOrthographicCamera(
  THREE: typeof Three,
  sceneObject: ThreeScene,
): Three.OrthographicCamera {
  const height = getOrthographicHeight(sceneObject);
  const width = height * (sceneObject.width / sceneObject.height);
  return new THREE.OrthographicCamera(
    -width / 2,
    width / 2,
    height / 2,
    -height / 2,
    sceneObject.cameraNear,
    sceneObject.cameraFar,
  );
}

function getOrthographicHeight(sceneObject: ThreeScene): number {
  if (sceneObject.cameraOrthographicHeight !== null && sceneObject.cameraOrthographicHeight > 0) {
    return sceneObject.cameraOrthographicHeight;
  }

  const cameraDistance = Math.hypot(
    sceneObject.cameraX - sceneObject.targetX,
    sceneObject.cameraY - sceneObject.targetY,
    sceneObject.cameraZ - sceneObject.targetZ,
  );

  if (cameraDistance === 0) {
    return sceneObject.height;
  }

  return 2 * cameraDistance * Math.tan(degreesToRadians(sceneObject.cameraFov) / 2);
}

function configureScene(THREE: typeof Three, runtime: Runtime, sceneObject: ThreeScene): void {
  if (sceneObject.backgroundColor === null) {
    runtime.renderer.setClearColor(0x000000, 0);
  } else {
    runtime.renderer.setClearColor(
      colorToThreeHex(sceneObject.backgroundColor),
      getAlphaForColor(sceneObject.backgroundColor),
    );
  }

  const ambient = new THREE.AmbientLight(
    colorToThreeHex(sceneObject.ambientLightColor),
    sceneObject.ambientLightIntensity,
  );
  runtime.scene.add(ambient);

  const directional = new THREE.DirectionalLight(
    colorToThreeHex(sceneObject.directionalLightColor),
    sceneObject.directionalLightIntensity,
  );
  directional.position.set(
    sceneObject.directionalLightX,
    sceneObject.directionalLightY,
    sceneObject.directionalLightZ,
  );
  runtime.scene.add(directional);
}

function clearScene(scene: Three.Scene): void {
  while (scene.children.length > 0) {
    const child = scene.children[0];
    if (child !== undefined) {
      disposeRendererOwnedResources(child);
      scene.remove(child);
    }
  }
}

function createObject3D(
  THREE: typeof Three,
  mesh: ThreeMesh,
  originalMesh: ThreeMesh,
  getCurrentObject: <TObject extends SlideObject>(object: TObject) => TObject | undefined,
): Three.Object3D | null {
  switch (mesh.objectType) {
    case ThreeObjectType.BOX:
      return createBox(THREE, mesh as ThreeBox);
    case ThreeObjectType.SPHERE:
      return createSphere(THREE, mesh as ThreeSphere);
    case ThreeObjectType.MODEL:
      return createModel(THREE, mesh as ThreeModel, originalMesh as ThreeModel, getCurrentObject);
    default:
      return null;
  }
}

function createBox(THREE: typeof Three, box: ThreeBox): Three.Mesh {
  const geometry = new THREE.BoxGeometry(box.width, box.height, box.depth);
  markRendererOwnedResource(geometry);

  return new THREE.Mesh(geometry, createMaterial(THREE, box));
}

function createSphere(THREE: typeof Three, sphere: ThreeSphere): Three.Mesh {
  const geometry = new THREE.SphereGeometry(
    sphere.radius,
    sphere.widthSegments,
    sphere.heightSegments,
  );
  markRendererOwnedResource(geometry);

  return new THREE.Mesh(geometry, createMaterial(THREE, sphere));
}

function createModel(
  THREE: typeof Three,
  model: ThreeModel,
  originalModel: ThreeModel,
  getCurrentObject: <TObject extends SlideObject>(object: TObject) => TObject | undefined,
): Three.Object3D | null {
  if (model.src === "") {
    return null;
  }

  const modelScene = getLoadedModelScene(model.src);
  if (modelScene === null) {
    console.warn(`3D model was not preloaded: ${model.src}`);
    return null;
  }

  const clonedScene = modelScene.clone(true);
  applyModelMaterialOverrides(clonedScene, model);
  applyModelMaterialTargetOverrides(clonedScene, model, originalModel, getCurrentObject);
  applyModelNodeOverrides(clonedScene, model, originalModel, getCurrentObject);
  return clonedScene;
}

function createMaterial(THREE: typeof Three, mesh: ThreeMesh): Three.MeshStandardMaterial {
  const material = new THREE.MeshStandardMaterial({
    color: colorToThreeHex(mesh.color),
    opacity: mesh.opacity * getAlphaForColor(mesh.color),
    transparent: mesh.opacity < 1 || getAlphaForColor(mesh.color) < 1,
    wireframe: mesh.wireframe,
  });
  markRendererOwnedResource(material);
  return material;
}

function applyModelMaterialOverrides(object: Three.Object3D, model: ThreeModel): void {
  if (!hasMaterialOverrides(model)) {
    return;
  }

  object.traverse((child) => {
    if (!isMesh(child)) {
      return;
    }
    updateMeshMaterials(child, model, () => true);
  });
}

function applyModelMaterialTargetOverrides(
  object: Three.Object3D,
  model: ThreeModel,
  originalModel: ThreeModel,
  getCurrentObject: <TObject extends SlideObject>(object: TObject) => TObject | undefined,
): void {
  for (const originalMaterial of originalModel.materials) {
    const material = getCurrentObject(originalMaterial) ?? originalMaterial;
    if (!hasMaterialOverrides(material)) {
      continue;
    }

    let matchCount = 0;
    object.traverse((child) => {
      if (!isMesh(child)) {
        return;
      }

      updateMeshMaterials(child, material, (meshMaterial) => {
        const isMatch = materialMatchesTarget(meshMaterial, material);
        if (isMatch) {
          matchCount++;
        }
        return isMatch;
      });
    });
    warnForTargetMatchCount(model.src, "material", material, matchCount);
  }
}

function applyModelNodeOverrides(
  object: Three.Object3D,
  model: ThreeModel,
  originalModel: ThreeModel,
  getCurrentObject: <TObject extends SlideObject>(object: TObject) => TObject | undefined,
): void {
  const objectPaths = collectObjectPaths(object);
  for (const originalNode of originalModel.nodes) {
    const node = getCurrentObject(originalNode) ?? originalNode;
    const matches = objectPaths.filter((objectPath) => nodeMatchesTarget(objectPath, node));
    warnForTargetMatchCount(model.src, "node", node, matches.length);

    for (const match of matches) {
      applyNodeTransform(match.object, node);
      if (hasMaterialOverrides(node)) {
        applyNodeMaterialOverrides(match.object, node);
      }
    }
  }
}

function applyNodeTransform(object: Three.Object3D, node: ThreeModelNode): void {
  object.position.set(
    object.position.x + node.x,
    object.position.y + node.y,
    object.position.z + node.z,
  );
  object.rotation.set(
    object.rotation.x + degreesToRadians(node.rotationX),
    object.rotation.y + degreesToRadians(node.rotationY),
    object.rotation.z + degreesToRadians(node.rotationZ),
  );
  object.scale.set(
    object.scale.x * node.scale * node.scaleX,
    object.scale.y * node.scale * node.scaleY,
    object.scale.z * node.scale * node.scaleZ,
  );
}

function applyNodeMaterialOverrides(object: Three.Object3D, node: ThreeModelNode): void {
  object.traverse((child) => {
    if (isMesh(child)) {
      updateMeshMaterials(child, node, () => true);
    }
  });
}

function nodeMatchesTarget(
  objectPath: { readonly object: Three.Object3D; readonly path: readonly string[] },
  target: ThreeModelNode,
): boolean {
  if (target.path !== null) {
    return objectPathMatches(objectPath.path, target.path);
  }
  if (target.presenterId !== null) {
    return getPresenterId(objectPath.object) === target.presenterId;
  }
  if (target.name !== null) {
    return objectPath.object.name === target.name;
  }
  return false;
}

function materialMatchesTarget(material: Three.Material, target: ThreeModelMaterial): boolean {
  if (target.presenterId !== null) {
    return getPresenterId(material) === target.presenterId;
  }
  if (target.name !== null) {
    return material.name === target.name;
  }
  return false;
}

function warnForTargetMatchCount(
  src: string,
  targetType: "material" | "node",
  target: ThreeModelTarget | Omit<ThreeModelTarget, "path">,
  matchCount: number,
): void {
  if (matchCount === 1 || (targetType === "material" && matchCount > 1)) {
    return;
  }

  const targetDescription = modelTargetToString(target);
  const key = `${src}:${targetType}:${targetDescription}:${matchCount}`;
  if (loggedTargetWarningKeys.has(key)) {
    return;
  }

  loggedTargetWarningKeys.add(key);
  const message =
    matchCount === 0
      ? `ThreeModel ${src} did not find ${targetType} target ${targetDescription}.`
      : `ThreeModel ${src} found ${matchCount} ${targetType} targets for ${targetDescription}. Use a path or presenterId to make the target unique.`;
  console.warn(message);
}

function updateMeshMaterials(
  mesh: Three.Mesh,
  state: MaterialOverrideState,
  predicate: (material: Three.Material) => boolean,
): void {
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  let didUpdate = false;
  const updatedMaterials = materials.map((material) => {
    if (!predicate(material)) {
      return material;
    }
    didUpdate = true;
    const updatedMaterial = getWritableMaterial(material);
    applyMaterialOverride(updatedMaterial, state);
    return updatedMaterial;
  });

  if (!didUpdate) {
    return;
  }

  if (Array.isArray(mesh.material)) {
    mesh.material = updatedMaterials;
  } else {
    const updatedMaterial = updatedMaterials[0];
    if (updatedMaterial !== undefined) {
      mesh.material = updatedMaterial;
    }
  }
}

function getWritableMaterial(material: Three.Material): CustomizableMaterial {
  if (isRendererOwnedResource(material)) {
    return material as CustomizableMaterial;
  }

  const updatedMaterial = material.clone() as CustomizableMaterial;
  markRendererOwnedResource(updatedMaterial);
  return updatedMaterial;
}

function applyMaterialOverride(material: CustomizableMaterial, state: MaterialOverrideState): void {
  if (state.materialColor !== null && material.color !== undefined) {
    material.color.setHex(colorToThreeHex(state.materialColor));
  }

  const targetOpacity =
    material.opacity *
    state.opacity *
    (state.materialColor !== null ? getAlphaForColor(state.materialColor) : 1);
  if (targetOpacity !== material.opacity) {
    material.opacity = targetOpacity;
    material.transparent = true;
  }

  if (state.wireframe) {
    material.wireframe = true;
  }
}

function hasMaterialOverrides(state: MaterialOverrideState): boolean {
  return state.materialColor !== null || state.opacity !== 1 || state.wireframe;
}

function applyMeshTransform(object: Three.Object3D, mesh: ThreeMesh): void {
  object.position.set(mesh.x, mesh.y, mesh.z);
  object.rotation.set(
    degreesToRadians(mesh.rotationX),
    degreesToRadians(mesh.rotationY),
    degreesToRadians(mesh.rotationZ),
  );
  object.scale.set(mesh.scale * mesh.scaleX, mesh.scale * mesh.scaleY, mesh.scale * mesh.scaleZ);
}

function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function disposeRendererOwnedResources(object: Three.Object3D): void {
  object.traverse((child) => {
    if (!isMesh(child)) {
      return;
    }

    if (isRendererOwnedResource(child.geometry)) {
      child.geometry.dispose();
    }

    const materials = Array.isArray(child.material) ? child.material : [child.material];
    for (const material of materials) {
      if (isRendererOwnedResource(material)) {
        material.dispose();
      }
    }
  });
}

function isMesh(object: Three.Object3D): object is Three.Mesh {
  return "isMesh" in object && object.isMesh === true;
}

interface MaterialOverrideState {
  readonly opacity: number;
  readonly materialColor: Color | null;
  readonly wireframe: boolean;
}

interface CustomizableMaterial extends Three.Material {
  color?: Three.Color;
  wireframe?: boolean;
}

function markRendererOwnedResource(resource: { userData: Record<string, unknown> }): void {
  resource.userData.presenterRendererOwned = true;
}

function isRendererOwnedResource(resource: { userData?: Record<string, unknown> }): boolean {
  return resource.userData?.presenterRendererOwned === true;
}
