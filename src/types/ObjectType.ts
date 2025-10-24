export const ObjectType = {
  ARROW: "Arrow",
  CIRCLE: "Circle",
  GROUP: "Group",
  IMAGE: "Image",
  LINE: "Line",
  MASK: "Mask",
  PATH: "Path",
  RECTANGLE: "Rectangle",
  SLIDE_OBJECT: "SlideObject",
  TEXT: "Text",
} as const;

export type ObjectType = (typeof ObjectType)[keyof typeof ObjectType];
