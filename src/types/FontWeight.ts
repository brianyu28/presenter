export const FontWeight = {
  THIN: 100,
  EXTRA_LIGHT: 200,
  LIGHT: 300,
  NORMAL: 400,
  MEDIUM: 500,
  SEMI_BOLD: 600,
  BOLD: 700,
  EXTRA_BOLD: 800,
  BLACK: 900,
} as const;

export type FontWeight = (typeof FontWeight)[keyof typeof FontWeight];

export const DEFAULT_FONT_WEIGHT: FontWeight = FontWeight.NORMAL;
