export function isInteractiveElement(target: EventTarget | null): boolean {
  if (target === null) {
    return false;
  }

  const element = target as HTMLElement;
  const tagName = element.tagName?.toLowerCase();
  if (
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select" ||
    tagName === "button" ||
    element.isContentEditable
  ) {
    return true;
  }

  return (element.closest?.("[contenteditable=''], [contenteditable='true']") ?? null) !== null;
}
