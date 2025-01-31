import { Text, TextProps } from "../objects/text";

export class MainTitle extends Text {
  constructor(text: string, props: Partial<TextProps> = {}) {
    super(text, {
      position: { x: 0.5, y: 0.5 },
      anchor: "center",
      fontSize: 250,
      fontWeight: 700,
      ...props,
    });
  }
}
