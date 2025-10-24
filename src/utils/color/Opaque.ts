import { Color } from "../../types/Color";

export function Opaque(color: Color = Color.BLACK): Color {
  return { ...color, alpha: 1 };
}
