/**
 * Clamps a value to a given range.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Maps a [0, 1] value linearly onto [0, 1].
 */
export function easeLinear(value: number): number {
  return clamp(value, 0, 1);
}

/**
 * Maps a [0, 1] value onto [0, 1] via a smoothstep cubic easing function.
 */
export function easeCubic(value: number): number {
  const t = clamp(value, 0, 1);
  return t ** 2 * (3 - 2 * t);
}
