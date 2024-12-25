import { Circle, Group, Rectangle, Slide } from "presenter";

export default class GroupSlide extends Slide {
  constructor() {
    const square = new Rectangle({
      width: 300,
      height: 300,
      position: { x: 0, y: 0 },
      fill: "#ff0000",
    });

    const circle = new Circle({
      radius: 150,
      position: { x: 400, y: 0 },
      fill: "#00ff00",
    });

    // A group can combine multiple other elements into a single entity.
    const group = new Group([square, circle], {
      // A group doesn't need to have a position. If it is positioned,
      // elements retain their positions relative to each other but the group
      // is positioned as a whole.
      position: { x: 0.5, y: 0.5 },
      anchor: "center",
      // By default, a group rotates around its top-left corner. Rotation
      // origin can specify a different point relative to the group's
      // top-left corner to use as the point of rotation.
      rotationOrigin: { x: 700, y: 300 },
    });

    super(
      [group],
      [
        // Individual items in a group can be animated independently.
        square.animate({ fill: "#0000ff" }),
        // Group's scale and rotation can be animated.
        group.animate({ scale: 2 }),
        group.animate({ rotation: 90 }),
      ],
    );
  }
}
