# Presenter Export Server

Some Presenter.js exports require additional processing, particularly if
slides contain content across different components, e.g. a combination of SVG
content and Canvas-based additional content, since Presenter.js has support
for an arbitrary additional `canvas` element that may contain additional
visual content for the slide.

In those cases, `presenter/export` can send data to this locally-running
Presenter Export Server to handle additional image processing before saving
exported assets.

For simple slides (i.e. SVG-only content), `presenter/export` can export
images directly from the browser without an additional server.

## Usage

First, install dependencies.

```bash
pip install requirements.txt
```

Then, set environment variable for where exported files should land.

```bash
export OUTPUT_DESTINATION=/path/to/destination
```

Then, run server.

```bash
flask run
```

### Sample Client

In a Presenter.js project:

```typescript
import { renderPresentationAsImages } from "presenter-export";
import { Presentation } from "presenter";

const presentation = new Presentation(
  "Sample Presentation",
  [
    /* ... slides here ... */
  ],
  document.body,
);

presentation.present();

// Immediately after presenting, export all slides to local server.
if (confirm("Download?")) {
  exportAllSlides(presentation, "http://127.0.0.1:5000");
}
```

By default, this will generate one `.png` email for each slide in the
presentation. If a presentation has animations, then by default the first build
of the slide will be exported (before any animations). To configure this, set
the `keyBuilds` property on any slide to specify which animations should be
rendered.
