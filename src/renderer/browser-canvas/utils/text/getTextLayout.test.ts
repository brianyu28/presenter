import { getTextLayout } from "./getTextLayout";
import { TextUnitMeasurement } from "./getTextUnitMeasurements";

function measurement(props: Partial<TextUnitMeasurement>): TextUnitMeasurement {
  return {
    baselineShift: 0,
    bottom: 30,
    height: 120,
    lineAdvance: 100,
    top: 90,
    width: 100,
    ...props,
  };
}

describe("getTextLayout", () => {
  test("uses line advance instead of font box height for baseline spacing", () => {
    const layout = getTextLayout([[measurement({ width: 120 })], [measurement({ width: 80 })]], 1);

    expect(layout.baselines).toEqual([90, 190]);
    expect(layout.size).toEqual({
      height: 220,
      width: 120,
    });
  });

  test("applies line spacing as a multiplier of line advance", () => {
    const layout = getTextLayout([[measurement({})], [measurement({})]], 1.2);

    expect(layout.baselines).toEqual([90, 210]);
    expect(layout.size.height).toBe(240);
  });

  test("uses both adjacent line boxes when font sizes differ", () => {
    const layout = getTextLayout(
      [
        [measurement({ bottom: 5, height: 25, lineAdvance: 20, top: 20 })],
        [measurement({ bottom: 30, height: 120, lineAdvance: 100, top: 90 })],
      ],
      1,
    );

    expect(layout.baselines).toEqual([20, 102.5]);
    expect(layout.size.height).toBe(132.5);
  });
});
