/**
 * Mutable state held by presentation for tracking shortcuts to jump between slides.
 *
 */

export interface ShortcutState {
  /** Currently typed text command. */
  textCommand: string | null;

  shortcuts: Record<string, ShortcutConfig>;
}

export interface ShortcutConfig {
  readonly slideIndex: number | null;
  readonly buildIndex: number;
}
