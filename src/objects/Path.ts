import { svgPathProperties } from "svg-path-properties";

import { Anchor, DEFAULT_ANCHOR } from "../types/Anchor";
import { Color, DEFAULT_COLOR } from "../types/Color";
import { ObjectType } from "../types/ObjectType";
import { SlideObject } from "../types/SlideObject";
import { Transparent } from "../utils/color/Transparent";

export interface Path extends SlideObject {
  readonly objectType: typeof ObjectType.PATH;
  readonly anchor: Anchor;
  readonly color: Color;
  readonly drawn: number;
  readonly fill: Color;
  readonly height: number;
  readonly path: string;
  readonly pathLength: number;
  readonly strokeWidth: number;
  readonly viewboxHeight: number;
  readonly viewboxWidth: number;
  readonly width: number;
  readonly x: number;
  readonly y: number;
}

export function Path(props: Partial<Path> | null = null): Path {
  const { path, height = 100, width = 100, viewboxHeight, viewboxWidth, ...rest } = props ?? {};
  const pathDescription = path ?? "M 0 0 L 100 100";

  const pathProperties = new svgPathProperties(pathDescription);
  const pathLength = pathProperties.getTotalLength();

  return SlideObject({
    objectType: ObjectType.PATH,
    anchor: DEFAULT_ANCHOR,
    color: DEFAULT_COLOR,
    drawn: 1,
    fill: Transparent(),
    height,
    path: pathDescription,
    pathLength,
    strokeWidth: 4,
    viewboxHeight: viewboxHeight ?? height,
    viewboxWidth: viewboxWidth ?? width,
    width,
    x: 0,
    y: 0,
    ...rest,
  });
}
