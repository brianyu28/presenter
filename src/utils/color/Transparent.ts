import { Color } from "../../types/Color";

export function Transparent(color: Color = Color.BLACK): Color {
  return { ...color, alpha: 0 };
}
