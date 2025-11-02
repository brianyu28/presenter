import { Anchor, DEFAULT_ANCHOR } from "../types/Anchor";
import { SlideObject } from "../types/SlideObject";
import { Group } from "./Group";

export interface GridProps {
  readonly anchor: Anchor;

  /** Number of columns in the grid. */
  readonly cols: number;

  /** Pixels of horizontal space between objects in the grid. */
  readonly gapX: number;

  /** Pixels of vertical space between objects in the grid. */
  readonly gapY: number;

  /**
   * Height, in pixels, of each object in the grid.
   *
   * If height is variable, a function can be provided that maps the row/col indices to a height.
   */
  readonly height: number | ((row: number, col: number) => number);

  /** Function mapping row/col indices to the object in the grid at that index. */
  readonly objects: (row: number, col: number) => SlideObject | null;

  /** Number of rows in the grid. */
  readonly rows: number;

  /**
   * Width, in pixels, of each object in the grid.
   *
   * If width is variable, a function can be provided that maps the row/col indices to a width.
   */
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
