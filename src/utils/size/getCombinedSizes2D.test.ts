import { Size } from "../../types/Size";
import { getCombinedSizes2D } from "./getCombinedSizes2D";

describe("getCombinedSizes2D", () => {
  test("combines 2D sizes across multiple lines", () => {
    const sizes = [
      [Size({ width: 10, height: 20 }), Size({ width: 15, height: 25 })],
      [Size({ width: 10, height: 20 }), Size({ width: 25, height: 25 })],
    ];
    expect(getCombinedSizes2D(sizes)).toEqual(Size({ width: 35, height: 50 }));
  });
});
