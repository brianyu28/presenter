import { Circle } from "../objects/circle";
import { Group, GroupProps } from "../objects/group";
import { Text, TextContent, TextProps } from "../objects/text";

export interface BulletsProps extends GroupProps {
  showBullets: boolean;
  bulletSize: number;
  bulletColor: string;
  lineSpacing: number;
  lineHeight: number | null;

  // Horizontal spacing around bullets and text
  bulletOffset: number;
  textOffset: number;

  // Vertical offset of bullet from center of text line
  bulletVerticalOffset: number;
}

export class Bullets extends Group {
  constructor(
    items: TextContent[],
    props: Partial<BulletsProps> = {},
    textProps: Partial<TextProps> = {},
  ) {
    const {
      showBullets,
      bulletSize,
      bulletColor,
      lineSpacing,
      bulletOffset,
      textOffset,
    } = {
      showBullets: true,
      bulletSize: 35,
      bulletColor: "#000000",
      lineSpacing: 90,
      bulletOffset: 75,
      textOffset: 75,
      ...props,
    };

    const fontSize = textProps.fontSize ?? 150;
    const lineHeight = props.lineHeight ?? fontSize;
    const bulletVerticalOffset = props.bulletVerticalOffset ?? lineHeight / 3;

    let bulletY = 0;
    const bullets: Group[] = items.map((item) => {
      const isMultiline = item instanceof Array;
      const circle = new Circle({
        radius: bulletSize,
        fill: bulletColor,
        position: {
          x: 0,
          y: bulletVerticalOffset,
        },
        anchor: "topleft",
      });
      const text = new Text(item, {
        position: { x: bulletSize * 2 + textOffset, y: 0 },
        anchor: "topleft",
        fontSize: fontSize,
        ...textProps,
      });
      const group = new Group([...(showBullets ? [circle] : []), text], {
        position: { x: 0, y: bulletY },
      });
      const lineCount = isMultiline ? item.length : 1;
      bulletY += lineCount * lineHeight + lineSpacing;
      return group;
    });

    super(bullets, {
      position: { x: bulletOffset, y: 0.6 },
      anchor: "left",
      ...props,
    });
  }
}
