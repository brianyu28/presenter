import { ObjectProps, SlideObject } from "../presentation/object";
import { Video } from "./video";

export interface SceneProps {
  length: number;
}

export interface Keyframe<Props extends ObjectProps> {
  object: SlideObject<Props>;
  timestamp: number;
  props: Partial<Props>;
}

export class Scene {
  objects: SlideObject<any>[];

  /**
   * A scene has a set of `objects` that are part of the scene.
   * However, some of those objects might contain child elements that also need to be animated.
   * `trackedObjects` contains all of the normal `objects` plus any child objects to animate.
   */
  trackedObjects: SlideObject<any>[];

  keyframes: Keyframe<any>[];

  props: SceneProps;

  constructor(
    objects: SlideObject<any>[],
    keyframes: Keyframe<any>[] = [],
    props: Partial<SceneProps> = {},
  ) {
    this.objects = objects;
    this.keyframes = keyframes;
    this.props = {
      length: 1000,
      ...props,
    };
    this.computeTrackedObjects();
  }

  /**
   * Sets the scene's list of `trackedObjects` by checking which objects need to be animated.
   */
  computeTrackedObjects() {
    const trackedObjects = new Set(this.objects);
    for (const keyframe of this.keyframes) {
      if (!trackedObjects.has(keyframe.object)) {
        trackedObjects.add(keyframe.object);
      }
    }
    this.trackedObjects = Array.from(trackedObjects);
  }

  render(video: Video, timestamp: number) {
    this.objects.forEach((object) => {
      object.generate(video);
    });

    // Append objects to SVG
    this.objects.forEach((object) => {
      video.svg.appendChild(object.element());
    });

    // TODO: Take into account timestamp.
  }
}
