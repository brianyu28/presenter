import {
  getRegisteredVariables,
  getVariableValue,
  VariableDefinition,
} from "../../../../types/Variable";

interface Args {
  readonly onCommit: () => void;
  readonly onPreview: (id: string, value: number) => number;
}

export function createVariableControlsElement({
  onCommit,
  onPreview,
}: Args): HTMLDivElement | null {
  const variables = getRegisteredVariables();
  if (variables.length === 0) {
    return null;
  }

  const container = document.createElement("div");
  Object.assign(container.style, {
    position: "absolute",
    right: "16px",
    bottom: "16px",
    zIndex: "20",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    width: "min(360px, calc(100% - 32px))",
    padding: "10px",
    boxSizing: "border-box",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    borderRadius: "8px",
    background: "rgba(16, 18, 22, 0.82)",
    color: "#ffffff",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: "12px",
    lineHeight: "1.25",
    pointerEvents: "auto",
    boxShadow: "0 12px 36px rgba(0, 0, 0, 0.28)",
    backdropFilter: "blur(10px)",
  });

  for (const variable of variables) {
    container.appendChild(createVariableControl(variable, onPreview, onCommit));
  }

  return container;
}

function createVariableControl(
  variable: VariableDefinition,
  onPreview: (id: string, value: number) => number,
  onCommit: () => void,
): HTMLDivElement {
  const row = document.createElement("div");
  row.dataset.presenterVariableId = variable.id;
  row.dataset.presenterVariableName = variable.name;
  Object.assign(row.style, {
    display: "grid",
    gridTemplateColumns: "72px minmax(0, 1fr) 74px",
    alignItems: "center",
    gap: "8px",
  });

  const name = document.createElement("div");
  name.textContent = variable.name;
  name.title = variable.name;
  Object.assign(name.style, {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: "rgba(255, 255, 255, 0.86)",
    fontWeight: "600",
  });

  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = variable.min.toString();
  slider.max = variable.max.toString();
  slider.step = variable.increment.toString();
  Object.assign(slider.style, {
    width: "100%",
    minWidth: "0",
    accentColor: "#8bc7ff",
  });

  const input = document.createElement("input");
  input.type = "number";
  input.min = variable.min.toString();
  input.max = variable.max.toString();
  input.step = variable.increment.toString();
  Object.assign(input.style, {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid rgba(255, 255, 255, 0.24)",
    borderRadius: "6px",
    padding: "4px 6px",
    background: "rgba(255, 255, 255, 0.1)",
    color: "#ffffff",
    font: "inherit",
  });

  let currentValue = getVariableValue(variable.id);

  const updateInputs = (value: number) => {
    const formattedValue = formatVariableValue(value);
    slider.value = formattedValue;
    input.value = formattedValue;
  };

  const previewValue = (value: number) => {
    if (!Number.isFinite(value)) {
      return;
    }

    currentValue = onPreview(variable.id, value);
    updateInputs(currentValue);
  };

  const commitValue = (value: number) => {
    if (!Number.isFinite(value)) {
      return;
    }

    if (value !== currentValue) {
      previewValue(value);
    }
    onCommit();
  };

  // Sliders emit `input` continuously while dragging. We preview those values in
  // storage, then wait for `change` so the page reload happens after release.
  slider.addEventListener("input", () => previewValue(slider.valueAsNumber));
  slider.addEventListener("change", () => commitValue(slider.valueAsNumber));
  input.addEventListener("change", () => commitValue(input.valueAsNumber));

  updateInputs(currentValue);

  row.appendChild(name);
  row.appendChild(slider);
  row.appendChild(input);

  return row;
}

function formatVariableValue(value: number): string {
  return Number.isInteger(value) ? value.toString() : parseFloat(value.toFixed(6)).toString();
}
