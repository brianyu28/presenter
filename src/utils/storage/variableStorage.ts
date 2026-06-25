// New variable values to use on next reload
const PENDING_VARIABLE_STORAGE_KEY_PREFIX = "presenterPendingVariables:";

interface StoredPendingVariableValues {
  readonly values: Record<string, number>;
}

export function loadPendingVariableValues(): Record<string, number> {
  const storage = getStorage();
  if (storage === null) {
    return {};
  }

  try {
    const storageKey = getPendingVariableStorageKey();
    const storedState = storage.getItem(storageKey);
    storage.removeItem(storageKey);

    if (storedState === null) {
      return {};
    }

    const parsedState = JSON.parse(storedState) as Partial<StoredPendingVariableValues>;
    if (parsedState.values === undefined || typeof parsedState.values !== "object") {
      return {};
    }

    const values: Record<string, number> = {};
    for (const [id, value] of Object.entries(parsedState.values)) {
      if (typeof value === "number" && Number.isFinite(value)) {
        values[id] = value;
      }
    }

    return values;
  } catch (error) {
    console.error("Failed to parse pending presenter variable state from sessionStorage:", error);
    storage.removeItem(getPendingVariableStorageKey());
    return {};
  }
}

export function storePendingVariableValues(values: Record<string, number>): void {
  const storage = getStorage();
  if (storage === null) {
    return;
  }

  storage.setItem(getPendingVariableStorageKey(), JSON.stringify({ values }));
}

function getPendingVariableStorageKey(): string {
  if (typeof window === "undefined") {
    return PENDING_VARIABLE_STORAGE_KEY_PREFIX;
  }

  return `${PENDING_VARIABLE_STORAGE_KEY_PREFIX}${window.location.origin}${window.location.pathname}`;
}

function getStorage(): Storage | null {
  try {
    return typeof sessionStorage === "undefined" ? null : sessionStorage;
  } catch {
    return null;
  }
}
