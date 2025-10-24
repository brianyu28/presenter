export interface Size {
  readonly height: number;
  readonly width: number;
}

export function Size(props: Partial<Size> | null = null): Size {
  return {
    height: 0,
    width: 0,
    ...props,
  };
}

export const DEFAULT_SIZE: Size = Size({ width: 0, height: 0 });
