import { SlideObject } from "../presentation/object";
import { BuildFunction } from "../util/animation";
import { Position } from "../util/position";
import { Group, GroupProps } from "./group";

// Though Rotator3D is a Group, the only props that should be set
// are the ones that are specific to Rotator3D.
interface Rotator3DProps extends GroupProps {
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  origin: Position;
}

export class Rotator3D extends Group {
  props: Rotator3DProps;

  static getCSSTransform(x: number, y: number, z: number) {
    return `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;
  }

  constructor(
    objects: SlideObject<any>[],
    props: Partial<Rotator3DProps> = {},
  ) {
    super(objects, {
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      origin: { x: 0.5, y: 0.5 },
      ...props,
    });
  }

  attributes(): Partial<Record<string, string>> {
    const origin = this.positionInPresentation(this.props.origin);
    return {
      ...super.attributes(),
      "transform-origin": `${origin.x}px ${origin.y}px`,
    };
  }

  styles(): Partial<Record<string, string>> {
    const { rotateX, rotateY, rotateZ } = this.props;
    return {
      ...super.styles(),
      transform: Rotator3D.getCSSTransform(rotateX, rotateY, rotateZ),
    };
  }

  // We don't include a "transform" attribute for rotators.
  // Transformations are handled by CSS.
  additionalAttributes(): Partial<Record<string, string>> {
    const { transform, ...rest } = super.additionalAttributes();
    return rest;
  }

  animate(
    props: Partial<Rotator3DProps>,
    animationParams: anime.AnimeParams = {},
    delay: number | null = null,
    animate: boolean = true,
  ): BuildFunction {
    const { rotateX, rotateY, rotateZ, ...rest } = props;
    const duration = (animationParams.duration ?? 500) as number;

    const targetX = rotateX ?? this.props.rotateX;
    const targetY = rotateY ?? this.props.rotateY;
    const targetZ = rotateZ ?? this.props.rotateZ;

    let startTime: number | null = null;
    let startX: number = 0;
    let startY: number = 0;
    let startZ: number = 0;

    const animateCallback = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      this.element().style.transform = Rotator3D.getCSSTransform(
        startX + progress * (targetX - startX),
        startY + progress * (targetY - startY),
        startZ + progress * (targetZ - startZ),
      );

      if (progress < 1) {
        requestAnimationFrame(animateCallback);
      }
    };

    return (run) => {
      if (Object.keys(rest).length > 0) {
        super.animate(rest, animationParams, delay, animate)(run);
      }
      run({
        animate: true,
        animateCallback: () => {
          startTime = null;
          startX = this.props.rotateX;
          startY = this.props.rotateY;
          startZ = this.props.rotateZ;
          requestAnimationFrame(animateCallback);
        },
        updateCallback: () => {
          startTime = null;
          this.element().style.transform = Rotator3D.getCSSTransform(
            targetX,
            targetY,
            targetZ,
          );
        },
      });
    };
  }

  set(
    props: Partial<Rotator3DProps>,
    delay: number | null = null,
  ): BuildFunction {
    return this.animate(props, {}, delay, false);
  }
}
