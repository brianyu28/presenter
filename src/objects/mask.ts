import { ObjectProps, SlideObject } from "../presentation/object";

export interface MaskProps extends ObjectProps {
  id: string;
  objects: SlideObject<any>[];
}

export class Mask extends SlideObject<MaskProps> {
  id: string;

  static maskIndex = 0;

  constructor(objects: SlideObject<any>[], props: Partial<MaskProps> = {}) {
    super({
      id: `mask-${Mask.maskIndex++}`,
      objects,
      ...props,
    });
    this.id = this.props.id;
  }

  tagName(): string {
    return "mask";
  }

  attributes(): Partial<Record<string, string>> {
    return {
      id: this.id,
    };
  }

  children(): Node[] {
    return this.props.objects.map((object) => {
      object.generate(this._presentation);
      return object._element;
    });
  }
}
