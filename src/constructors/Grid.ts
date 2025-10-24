import { Group } from "../objects/Group";
import { Anchor, DEFAULT_ANCHOR } from "../types/Anchor";
import { SlideObject } from "../types/SlideObject";

export interface GridProps {
  readonly anchor: Anchor;
  readonly cols: number;
  // Height of each individual object
  readonly gapX: number;
  readonly gapY: number;
  readonly height: number | ((row: number, col: number) => number);
  readonly objects: (row: number, col: number) => SlideObject | null;
  readonly rows: number;
  readonly width: number | ((row: number, col: number) => number);
  readonly x: number;
  readonly y: number;
}

interface Return {
  readonly grid: Group;
  readonly objects: (SlideObject | null)[][];
}

export function Grid(props: Partial<GridProps>): Return {
  const {
    anchor = DEFAULT_ANCHOR,
    cols = 1,
    rows = 1,
    gapX = 0,
    gapY = 0,
    width = 0,
    height = 0,
    x: originX = 0,
    y: originY = 0,
    objects = () => null,
  } = props;

  const gridObjects: (SlideObject | null)[][] = [];
  const groupObjects: SlideObject[] = [];

  let x = 0;
  let y = 0;
  for (let row = 0; row < rows; row++) {
    const rowObjects: (SlideObject | null)[] = [];
    x = 0;
    let rowHeight = 0;

    for (let col = 0; col < cols; col++) {
      const object = objects(row, col);
      const objectWidth = typeof width === "function" ? width(row, col) : width;
      const objectHeight = typeof height === "function" ? height(row, col) : height;

      rowObjects.push(object);
      if (object != null) {
        groupObjects.push(
          Group([object], {
            x,
            y,
          }),
        );
      }

      x += objectWidth + gapX;
      rowHeight = Math.max(rowHeight, objectHeight);
    }
    gridObjects.push(rowObjects);
    y += rowHeight + gapY;
  }

  const grid = Group(groupObjects, {
    x: originX,
    y: originY,
    height: y - gapY,
    width: x - gapX,
    anchor,
  });

  return {
    grid,
    objects: gridObjects,
  };
}
