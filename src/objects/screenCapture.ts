import { ObjectProps, SlideObject } from "../presentation/object";
import { BuildFunction } from "../util/animation";

export interface ScreenCaptureProps extends ObjectProps {
  width: string | number | null;
  height: string | number | null;
  scale: number;
  align: "left" | "center" | "right";
}

export class ScreenCapture extends SlideObject<ScreenCaptureProps> {
  videoElement: HTMLVideoElement | null;

  constructor(props: Partial<ScreenCaptureProps> = {}) {
    super({
      width: null,
      height: null,
      scale: 1,
      align: "left",
      ...props,
    });
    this.videoElement = null;
  }

  tagName(): string {
    return "foreignObject";
  }

  attributes(): Partial<Record<string, string>> {
    const { position, width, height } = this.props;

    const presentationWidth = this._presentation.options.width;
    const presentationHeight = this._presentation.options.height;

    return {
      ...super.attributes(),
      x: position.x.toString(),
      y: position.y.toString(),
      width: (width === null ? presentationWidth : width).toString(),
      height: (height === null ? presentationHeight : height).toString(),
    };
  }

  styles() {
    const { align } = this.props;
    return {
      ...super.styles(),
      "text-align": align,
    };
  }

  children() {
    const { scale, align } = this.props;

    const video = document.createElement("video");
    this.videoElement = video;
    video.autoplay = true;
    video.style.transform = `scale(${scale})`;
    video.style.transformOrigin =
      align === "left"
        ? "top left"
        : align === "center"
          ? "top center"
          : "top right";

    // Start screen sharing session
    const displayMediaOptions = {
      video: {
        displaySurface: "window",
      },
      audio: false,
    };
    navigator.mediaDevices
      .getDisplayMedia(displayMediaOptions)
      .then((stream) => {
        // If user ends screen sharing, hide the video.
        stream.getVideoTracks()[0].onended = function () {
          video.style.display = "none";
        };

        video.srcObject = stream;
        video.play();

        // Add cleanup handler to stop screen sharing.
        this._presentation.slideCleanupHandlers.push(() => {
          const tracks = (video.srcObject as MediaStream).getTracks();
          tracks.forEach((track) => track.stop());
          video.style.display = "none";
          video.srcObject = null;
        });
      })
      .catch((error) => {
        console.error("Could not start screen capture -", error);
      });

    return [video];
  }
}
