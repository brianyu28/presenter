/** An interpolator defines a function for interpolating between values of arbitrary type T. */
export interface Interpolator<T> {
  /** Function to check if a value should be interpolated with this interpolator. */
  readonly check: (value: unknown, propertyName: string) => value is T;

  /** Function to interpolate between two values. */
  readonly interpolate: (from: T, to: T, proportion: number) => T;
}
