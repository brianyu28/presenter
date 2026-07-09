import { Anchor, DEFAULT_ANCHOR } from "../../types/Anchor";
import { Color } from "../../types/Color";
import { SlideObject } from "../../types/SlideObject";
import { ThreeCameraType } from "./ThreeCameraType";
import { ThreeMesh } from "./ThreeMesh";
import { ThreeObjectType } from "./ThreeObjectType";

export interface ThreeScene extends SlideObject {
  readonly objectType: typeof ThreeObjectType.SCENE;
  readonly anchor: Anchor;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly meshes: ThreeMesh[];
  readonly fallbackImageId: string | null;
  readonly fallbackImagePath: string | null;
  readonly fallbackCornerRadius: number;
  readonly fallbackSmooth: boolean;
  readonly cameraType: ThreeCameraType;
  readonly cameraX: number;
  readonly cameraY: number;
  readonly cameraZ: number;
  readonly cameraFov: number;
  readonly cameraOrthographicHeight: number | null;
  readonly cameraNear: number;
  readonly cameraFar: number;
  readonly targetX: number;
  readonly targetY: number;
  readonly targetZ: number;
  readonly backgroundColor: Color | null;
  readonly ambientLightColor: Color;
  readonly ambientLightIntensity: number;
  readonly directionalLightColor: Color;
  readonly directionalLightIntensity: number;
  readonly directionalLightX: number;
  readonly directionalLightY: number;
  readonly directionalLightZ: number;
}

export function ThreeScene(
  meshes: ThreeMesh[],
  props: Partial<Omit<ThreeScene, "meshes">> | null = null,
): ThreeScene {
  return SlideObject({
    objectType: ThreeObjectType.SCENE,
    anchor: DEFAULT_ANCHOR,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    meshes,
    fallbackImageId: null,
    fallbackImagePath: null,
    fallbackCornerRadius: 0,
    fallbackSmooth: true,
    cameraType: ThreeCameraType.PERSPECTIVE,
    cameraX: 0,
    cameraY: 0,
    cameraZ: 5,
    cameraFov: 50,
    cameraOrthographicHeight: null,
    cameraNear: 0.1,
    cameraFar: 2000,
    targetX: 0,
    targetY: 0,
    targetZ: 0,
    backgroundColor: null,
    ambientLightColor: Color.WHITE,
    ambientLightIntensity: 1,
    directionalLightColor: Color.WHITE,
    directionalLightIntensity: 2,
    directionalLightX: 3,
    directionalLightY: 4,
    directionalLightZ: 5,
    ...props,
  });
}
