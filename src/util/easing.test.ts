import { easeCubic } from "./easing";

describe("easeCubic", () => {
  test("interpolates value along cubic curve", () => {
    expect(easeCubic(0.25)).toBeCloseTo(0.15625, 5);
  });
  test("preserves value for 0.5", () => {
    expect(easeCubic(0.5)).toBeCloseTo(0.5, 5);
  });
  test("clamps value when below 0", () => {
    expect(easeCubic(-0.3)).toBe(0);
  });
  test("clamps value when above 1", () => {
    expect(easeCubic(1.2)).toBe(1);
  });
});
