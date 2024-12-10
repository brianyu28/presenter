# Presenter.js

Presenter.js is a JavaScript library for creating visual presentations.

This library is still in development and its API may change at any time.

## Getting Started

### Installing Presenter.js

Install Presenter.js via `npm`.

```
$ npm install presenter
```

### Sample Usage

Create a presentation by specifying a list of slides, where each slide may contain objects and animations.

```javascript
import { Presentation, Slide, Text } from "presenter";

const slide = new Slide([
  new Text("Welcome to Presenter.js!", {
    position: { x: 0.5, y: 0.5 },
    anchor: "center",
    fontSize: 150,
  }),
]);

document.addEventListener("DOMContentLoaded", () => {
  const presentation = new Presentation(
    "My Presentation",
    [slide],
    document.body,
  );

  presentation.present();
});
```
