import { Theme } from "./theme";

export interface ObjectProps {
  x: number;
  y: number;
}

export class SlideObject {
  props: Partial<ObjectProps>;

  constructor(props: Partial<ObjectProps>) {
    this.props = props;
  }

  render(theme: Theme): SVGElement {
    return null;
  }
}
