import { Text } from "presenter";
import { Scene, Video } from "presenter/video";

const text = new Text("Frame", {
  position: { x: 0.5, y: 0.5 },
  anchor: "center",
  fontSize: 150,
});

const scene = new Scene(
  [text],
  [
    {
      object: text,
      timestamp: 10,
      props: { position: { x: 0.5, y: 0.5 } },
    },
    {
      object: text,
      timestamp: 100,
      props: { position: { x: 0.5, y: 0.9 } },
    },
  ],
);

document.addEventListener("DOMContentLoaded", () => {
  const video = new Video("My Video", [scene], document.body);

  video.present();
});
