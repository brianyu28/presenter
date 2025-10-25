export const ObjectType = {
  ARROW: "Arrow",
  CIRCLE: "Circle",
  GROUP: "Group",
  IMAGE: "Image",
  LINE: "Line",
  MASK: "Mask",
  PATH: "Path",
  POLYGON: "Polygon",
  RECTANGLE: "Rectangle",
  SLIDE_OBJECT: "SlideObject",
  TEXT: "Text",
} as const;

export type ObjectType = (typeof ObjectType)[keyof typeof ObjectType];
