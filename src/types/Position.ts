export interface Position {
  readonly x: number;
  readonly y: number;
}

export function Position(props: Partial<Position> | null = null): Position {
  return {
    x: 0,
    y: 0,
    ...props,
  };
}

export const DEFAULT_POSITION = Position();
