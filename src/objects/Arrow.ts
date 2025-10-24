import { Color, DEFAULT_COLOR } from "../types/Color";
import { ObjectType } from "../types/ObjectType";
import { SlideObject } from "../types/SlideObject";

export interface Arrow extends SlideObject {
  readonly objectType: typeof ObjectType.ARROW;
  readonly arrowheadSize: number;
  readonly color: Color;
  readonly drawn: number;
  readonly endX: number;
  readonly endY: number;
  readonly isArrowheadDoubled: boolean;
  readonly isArrowheadFilled: boolean;
  readonly isDrawnFromCenter: boolean;
  readonly startX: number;
  readonly startY: number;
  readonly width: number;
}

export function Arrow(props: Partial<Arrow> | null = null): Arrow {
  const { arrowheadSize: inputArrowheadSize, width = 10, ...rest } = props || {};
  const arrowheadSize = inputArrowheadSize ?? width * 4;

  return SlideObject({
    objectType: ObjectType.ARROW,
    arrowheadSize,
    color: DEFAULT_COLOR,
    drawn: 1,
    endX: 100,
    endY: 100,
    isArrowheadDoubled: false,
    isArrowheadFilled: false,
    isDrawnFromCenter: false,
    startX: 0,
    startY: 0,
    width,
    ...rest,
  });
}
