# Presenter.js

Presenter.js is a presentation tool for programmatically building animated visual slides.

This library is still in development and its API may change at any time.

## Getting Started

### Quick Start

The simplest way to get started with a Presenter.js presentation is via
`npm create presenter`.

```bash
$ npm create presenter
```

Running `npm create presenter` will prompt you to enter a project name and will
then create a new presentation with Presenter.js, written in TypeScript and
built with Webpack.

After creating the new presentation, `cd` into the directory and run
`npm run serve` to run the presentation. Edit `src/index.ts` to make changes
to your presentation.

### Installing Presenter.js Manually

Presenter.js can also be installed manually via `npm`.

```bash
$ npm install presenter
```

### Sample Usage

Create a presentation by specifying a list of slides, where each slide may
contain objects and animations.

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
