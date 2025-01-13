import { ObjectProps, SlideObject } from "../presentation/object";
import { BoundingBox, Position } from "../util/position";

export interface GroupProps extends ObjectProps {
  /**
   * A positioned group places the group's anchor at a particular coordinate.
   * A non-positioned group uses the position as an offset for its children.
   */
  positioned: boolean;
  objects: SlideObject<any>[];
  rotation: number;
  rotationOrigin: Position;
  scale: number;
}

export class Group extends SlideObject<GroupProps> {
  constructor(
    objects: SlideObject<any>[],
    props: Partial<GroupProps> = {},
    positioned: boolean | null = null,
  ) {
    super({
      objects,
      position: { x: 0, y: 0 },
      positioned: positioned === null ? "position" in props : positioned,
      rotation: 0,
      rotationOrigin: { x: 0, y: 0 },
      scale: 1,
      ...props,
    });
  }

  tagName(): string {
    return "g";
  }

  attributes(): Partial<Record<string, string>> {
    return {
      ...super.attributes(),
    };
  }

  additionalAttributes(): Partial<Record<string, string>> {
    const scale = this.props.scale;

    const rotationTransform = `rotate(${this.props.rotation}, ${this.props.rotationOrigin.x}, ${this.props.rotationOrigin.y})`;
    const scaleTransform = `scale(${scale})`;

    // If the group is not positioned, we don't need to separately account for the group's bounding box.
    if (!this.props.positioned) {
      const { x, y } = this.positionInPresentation(this.props.position);
      return {
        transform: `translate(${x}, ${y}) ${rotationTransform} ${scaleTransform}`,
      };
    }

    // For a positioned group, we want to adjust transformation of the bounding box.
    // First, we calculate the existing bounding box of the group.
    const bbox = this._presentation.computeRenderedBoundingBox(
      this._element as SVGGraphicsElement,
    );

    // Adjust the bounding box's size if the group has been scaled up.
    bbox.width *= scale;
    bbox.height *= scale;

    // Then, we determine where we want the group to be positioned.
    const { x, y } = this.positionInPresentation(this.props.position);
    const anchoredBox = this.anchorBoundingBox(
      new BoundingBox({ x, y }, bbox.width, bbox.height),
    );

    // Determine how much we need to transform group to get it at the correct position.
    const adjustedX = anchoredBox.origin.x - bbox.origin.x;
    const adjustedY = anchoredBox.origin.y - bbox.origin.y;

    return {
      transform: `translate(${adjustedX}, ${adjustedY}) ${rotationTransform} ${scaleTransform}`,
    };
  }

  children(): Node[] {
    return this.props.objects.map((object) => {
      object.generate(this._presentation);
      return object._element;
    });
  }
}
