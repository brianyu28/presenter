export const Anchor = {
  TOP_LEFT: "TopLeft",
  TOP: "Top",
  TOP_RIGHT: "TopRight",
  LEFT: "Left",
  CENTER: "Center",
  RIGHT: "Right",
  BOTTOM_LEFT: "BottomLeft",
  BOTTOM: "Bottom",
  BOTTOM_RIGHT: "BottomRight",
} as const;

export type Anchor = (typeof Anchor)[keyof typeof Anchor];

export const DEFAULT_ANCHOR: Anchor = Anchor.TOP_LEFT;
