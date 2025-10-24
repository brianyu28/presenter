export const Alignment = {
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right",
} as const;

export type Alignment = (typeof Alignment)[keyof typeof Alignment];

export const DEFAULT_ALIGNMENT: Alignment = Alignment.LEFT;
