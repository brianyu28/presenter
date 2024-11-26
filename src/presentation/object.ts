interface ObjectProps {
  x: number;
  y: number;
}

export class SlideObject {
  props: ObjectProps;

  constructor(props: ObjectProps) {
    this.props = props;
  }

  render() {}
}
