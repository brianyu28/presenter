import { ShortcutConfig } from "../../types/ShortcutState";

export function resolvePresentationShortcutCommand(
  shortcuts: Record<string, ShortcutConfig>,
  command: string,
): ShortcutConfig | null {
  const shortcutConfig = shortcuts[command];
  if (shortcutConfig !== undefined) {
    return shortcutConfig;
  }

  if (!isNaN(Number(command))) {
    return { slideIndex: Number(command) - 1, buildIndex: 0 };
  }

  return null;
}
