import { Color } from "../../types/Color";
import { SlideObject } from "../../types/SlideObject";

export interface ThreeMesh extends SlideObject {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly rotationX: number;
  readonly rotationY: number;
  readonly rotationZ: number;
  readonly scale: number;
  readonly scaleX: number;
  readonly scaleY: number;
  readonly scaleZ: number;
  readonly color: Color;
  readonly wireframe: boolean;
}

export const THREE_MESH_DEFAULTS = {
  x: 0,
  y: 0,
  z: 0,
  rotationX: 0,
  rotationY: 0,
  rotationZ: 0,
  scale: 1,
  scaleX: 1,
  scaleY: 1,
  scaleZ: 1,
  color: Color.WHITE,
  wireframe: false,
} as const;
