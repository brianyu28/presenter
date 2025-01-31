import { Text, TextProps } from "../objects/text";

export class SlideTitle extends Text {
  constructor(text: string, props: Partial<TextProps> = {}) {
    super(text, {
      position: { x: 0.02, y: 0.04 },
      anchor: "topleft",
      fontSize: 200,
      fontWeight: 700,
      ...props,
    });
  }
}
