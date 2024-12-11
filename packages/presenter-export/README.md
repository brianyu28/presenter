# `presenter-export`

This is a library with functions for exporting presentations from Presenter.js.

## Installation

Install with:

```bash
$ npm install presenter-export
```

## Sample Usage

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

// Immediately after presenting, download presentation as images.
renderPresentationAsImages(presentation);
```

By default, this will generate one `.png` email for each slide in the
presentation. If a presentation has animations, then by default the first build
of the slide will be exported (before any animations). To configure this, set
the `keyBuilds` property on any slide to specify which animations should be
rendered.
