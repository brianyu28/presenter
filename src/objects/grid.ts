/**
 * A grid of identical or similar objects.
 */

import { SlideObject } from "../presentation/object";
import { Position } from "../util/position";
import { Group, GroupProps } from "./group";

export interface GridProps extends Omit<GroupProps, "objects"> {
  // Origin of first element in grid.
  // Note that since we need to perform mathematical operations on origin and spacing,
  // origin cannot be represented as a relative offset of total size.
  origin: Position;

  // Space between objects.
  spacing: Partial<Position>;

  rows: number;
  cols: number;
  objects: (row: number, col: number) => SlideObject<any> | null;
}

export class Grid extends Group {
  objects: (SlideObject<any> | null)[][];

  constructor(props: Partial<GridProps>) {
    const {
      rows = 1,
      cols = 1,
      spacing = { x: 0, y: 0 },
      origin = { x: 0, y: 0 },
      objects: generator = () => null,
      ...groupProps
    } = props;
    if (spacing.x === undefined) {
      spacing.x = 0;
    }
    if (spacing.y === undefined) {
      spacing.y = 0;
    }

    const objects: (SlideObject<any> | null)[][] = [];
    for (let i = 0; i < rows; i++) {
      const row: (SlideObject<any> | null)[] = [];
      for (let j = 0; j < cols; j++) {
        const obj = generator(i, j);
        if (obj !== null) {
          obj.props.position.x = origin.x + spacing.x * j;
          obj.props.position.y = origin.y + spacing.y * i;
        }
        row.push(obj);
      }
      objects.push(row);
    }

    super([...objects.flat().filter((obj) => obj !== null)], groupProps);
    this.objects = objects;
  }
}
