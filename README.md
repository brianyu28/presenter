# Presenter.js

Presenter.js is a presentation tool for programmatically building animated visual slides.

[View Documentation](https://presenter.js.org)

## Get Started

Start a new project by creating a Presenter.js presentation:

```bash
npm create presenter
```

Or add Presenter.js to an existing project with `npm install presenter`.

## Presentation Structure

A presentation is a JavaScript object that includes an array of slides to render in order.

```typescript
export const presentation = Presentation({
  title: "Presentation",
  slides: [TitleSlide],
});
```

A slide specifies objects on the slide, plus any animations for those objects.

```typescript
import { Anchor, Slide, Text } from "presenter";
import { position } from "../size";

const title = Text("Welcome to Presenter.js!", {
  anchor: Anchor.CENTER,
  fontSize: 150,
  ...position(0.5, 0.5),
});

export const TitleSlide = Slide({
  objects: [title],
});
```

## Notes

This library is still in development and its API may change in the future.
