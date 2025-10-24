/** Values for the CSS font-style property. */
export const FontStyle = {
  NORMAL: "normal",
  ITALIC: "italic",
  OBLIQUE: "oblique",
} as const;

export type FontStyle = (typeof FontStyle)[keyof typeof FontStyle];

export const DEFAULT_FONT_STYLE: FontStyle = FontStyle.NORMAL;
