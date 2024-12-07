import { ObjectProps, SlideObject } from "../presentation/object";
import { Presentation } from "../presentation/presentation";

interface GroupProps extends ObjectProps {
  objects: SlideObject[];
}

export class Group extends SlideObject {
  props: GroupProps;

  constructor(objects: SlideObject[], props: Partial<GroupProps> = {}) {
    super({
      objects,
      position: { x: 0, y: 0 },
      ...props,
    });
  }

  generate(presentation: Presentation): SVGElement {
    const element = document.createElementNS("http://www.w3.org/2000/svg", "g");

    for (const object of this.props.objects) {
      const objectElement = object.generate(presentation);
      object._element = objectElement;
      element.appendChild(objectElement);
    }

    return element;
  }
}
