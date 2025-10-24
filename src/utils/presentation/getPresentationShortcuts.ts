import { Presentation } from "../../types/Presentation";
import { ShortcutConfig } from "../../types/ShortcutState";

export function getPresentationShortcuts(
  presentation: Presentation,
): Record<string, ShortcutConfig> {
  const { slides } = presentation;
  const shortcuts: Record<string, ShortcutConfig> = {
    // First build of first slide
    s: { slideIndex: 0, buildIndex: 0 },

    // First build of current slide
    c: { slideIndex: null, buildIndex: 0 },

    // Last build of last slide
    e: {
      slideIndex: slides.length - 1,
      buildIndex: slides[slides.length - 1]?.animations.length ?? 0,
    },
  };

  for (let slideIndex = 0; slideIndex < slides.length; slideIndex++) {
    const slide = slides[slideIndex];
    if (slide === undefined) {
      continue;
    }

    // Add shortcuts that jump directly to slides
    const shortcut = slide.shortcut;
    addShortcut(shortcuts, shortcut, slideIndex, 0);

    // Add shortcuts that jump directly to builds within slides
    for (let animationIndex = 0; animationIndex < slide.animations.length; animationIndex++) {
      const animation = slide.animations[animationIndex];
      if (animation === undefined) {
        continue;
      }

      if (Array.isArray(animation)) {
        for (const anim of animation) {
          addShortcut(shortcuts, anim.shortcut, slideIndex, animationIndex + 1);
        }
      } else {
        addShortcut(shortcuts, animation.shortcut, slideIndex, animationIndex + 1);
      }
    }
  }

  return shortcuts;
}

function addShortcut(
  shortcuts: Record<string, ShortcutConfig>,
  shortcut: string | string[] | null,
  slideIndex: number,
  buildIndex: number,
) {
  if (shortcut === null) {
    return;
  }

  if (Array.isArray(shortcut)) {
    for (const key of shortcut) {
      shortcuts[key] = { slideIndex, buildIndex };
    }
  } else {
    shortcuts[shortcut] = { slideIndex, buildIndex };
  }
}
