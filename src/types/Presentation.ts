import { Color } from "./Color";
import { Resources } from "./Resources";
import { Size } from "./Size";
import { Slide } from "./Slide";

export interface Presentation {
  /** The background color of the presentation. */
  readonly backgroundColor: Color;

  /** The slides to present as part of the presentation. */
  readonly slides: Slide[];

  /** The title of the presentation. */
  readonly title: string;

  /** The resources used in the presentation. */
  readonly resources: Resources;

  /** The dimensions of the presentation's viewport. */
  readonly size: Size;
}

export function Presentation(props: Partial<Presentation> | null = null): Presentation {
  return {
    backgroundColor: Color.WHITE,
    slides: [],
    title: "Presentation",
    size: Size({ width: 3840, height: 2160 }),
    resources: {
      images: {},
    },
    ...props,
  };
}
