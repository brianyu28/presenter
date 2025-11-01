import { Alignment } from "../types/Alignment";
import { Anchor, DEFAULT_ANCHOR } from "../types/Anchor";
import { SlideWebExtra } from "../types/SlideWebExtra";
import { assertNever } from "../utils/core/assertNever";

export interface ScreenCapture {
  readonly alignment: Alignment;
  readonly scale: number;

  readonly anchor: Anchor;
  readonly height: number;
  readonly width: number;
  readonly x: number;
  readonly y: number;
}

export function ScreenCapture(props: Partial<ScreenCapture> | null = null): SlideWebExtra {
  const {
    alignment = Alignment.LEFT,
    scale = 1,
    anchor = DEFAULT_ANCHOR,
    height = 1000,
    width = 1000,
    x = 0,
    y = 0,
  } = props || {};

  function setup(foreignObject: SVGForeignObjectElement) {
    // Create video element
    const video = document.createElement("video");
    video.autoplay = true;
    video.style.transform = `scale(${scale})`;

    switch (alignment) {
      case Alignment.LEFT:
        video.style.transformOrigin = "top left";
        break;
      case Alignment.CENTER:
        video.style.transformOrigin = "top center";
        break;
      case Alignment.RIGHT:
        video.style.transformOrigin = "top right";
        break;
      default:
        assertNever(alignment);
    }
    foreignObject.appendChild(video);

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
        const videoTrack = stream.getVideoTracks()[0];

        // If user ends screen sharing, hide the video.
        if (videoTrack !== undefined) {
          videoTrack.onended = function () {
            video.style.display = "none";
          };
        }

        video.srcObject = stream;
        video.play();
      })
      .catch((error) => {
        console.error("Could not start screen capture -", error);
      });

    // Stop screen sharing on cleanup
    return () => {
      const tracks = (video.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      video.style.display = "none";
      video.srcObject = null;
    };
  }

  return SlideWebExtra({
    content: null,
    setup,
    anchor,
    height,
    width,
    x,
    y,
  });
}
