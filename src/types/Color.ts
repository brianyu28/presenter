export interface Color {
  /** Red channel, in [0, 255] */
  red: number;

  /** Green channel, in [0, 255] */
  green: number;

  /** Blue channel, in [0, 255] */
  blue: number;

  /** Alpha channel, in [0, 1] */
  alpha: number;
}

type HexColor = `#${string}`;

export function Color(color: Partial<Color> | HexColor): Color;
export function Color(red: number, green: number, blue: number, alpha?: number): Color;
export function Color(
  color: Partial<Color> | HexColor | number,
  green: number = 0,
  blue: number = 0,
  alpha: number = 1,
): Color {
  if (typeof color === "string") {
    const hexString = color.replace("#", "");
    const hex = parseInt(hexString, 16);

    if (isNaN(hex)) {
      console.warn("Invalid hex color format:", color);
      return DEFAULT_COLOR;
    }

    if (hexString.length === 6) {
      return {
        red: (hex >> 16) & 255,
        green: (hex >> 8) & 255,
        blue: hex & 255,
        alpha: 1,
      };
    } else if (hexString.length === 8) {
      return {
        red: (hex >> 24) & 255,
        green: (hex >> 16) & 255,
        blue: (hex >> 8) & 255,
        alpha: (hex & 255) / 255,
      };
    } else {
      console.warn("Invalid hex color format:", color);
      return DEFAULT_COLOR;
    }
  } else if (typeof color === "number") {
    return {
      red: color,
      green: green ?? 0,
      blue: blue ?? 0,
      alpha: alpha ?? 1,
    };
  }

  return {
    red: 0,
    green: 0,
    blue: 0,
    alpha: 1,
    ...color,
  };
}

Color.BLACK = Color(0, 0, 0);
Color.BLUE = Color(0, 0, 255);
Color.GREEN = Color(0, 255, 0);
Color.RED = Color(255, 0, 0);
Color.WHITE = Color(255, 255, 255);

export const DEFAULT_COLOR: Color = { red: 0, green: 0, blue: 0, alpha: 1 };
