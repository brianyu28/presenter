import {
  getRegisteredVariables,
  getVariableValue,
  setVariableValue,
} from "../../../../types/Variable";
import { storePendingVariableValues } from "../../../../utils/storage/variableStorage";
import { createVariableControlsElement } from "./createVariableControlsElement";

interface Args {
  readonly container: HTMLElement;
  readonly onCommit: () => void;
}

export function mountVariableControls({ container, onCommit }: Args): void {
  const variablesContainer = createVariableControlsElement({
    onPreview: (id, value) => {
      const nextValue = setVariableValue(id, value);
      storePendingVariableValues(getCurrentVariableValues());
      return nextValue;
    },
    onCommit,
  });

  if (variablesContainer !== null) {
    container.appendChild(variablesContainer);
  }
}

function getCurrentVariableValues(): Record<string, number> {
  const values: Record<string, number> = {};

  for (const variable of getRegisteredVariables()) {
    values[variable.id] = getVariableValue(variable.id);
  }

  return values;
}
