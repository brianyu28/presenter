import { loadPendingVariableValues } from "../utils/storage/variableStorage";

export interface VariableProps {
  readonly name?: string;
  readonly min?: number;
  readonly max?: number;
  readonly default?: number;
  readonly increment?: number;
}

export interface VariableDefinition {
  readonly id: string;
  readonly name: string;
  readonly min: number;
  readonly max: number;
  readonly default: number;
  readonly increment: number;
}

const DEFAULT_VARIABLE_MIN = 0;
const DEFAULT_VARIABLE_MAX = 1;
const DEFAULT_VARIABLE_DEFAULT = 0;
const DEFAULT_VARIABLE_INCREMENT = 0.01;

const definitionsById = new Map<string, VariableDefinition>();

let variableValuesById = new Map<string, number>();
let didLoadPendingValues = false;
let nextVariableIndex = 1;

export function Variable(props: VariableProps | null = null): number {
  loadPendingValues();

  const options = props ?? {};
  const id = getNextVariableId();
  const definition = createDefinition(id, options);
  const activeValue = variableValuesById.get(definition.id);

  if (activeValue !== undefined) {
    const clampedValue = clampValue(activeValue, definition);
    variableValuesById.set(definition.id, clampedValue);
    return clampedValue;
  }

  return definition.default;
}

export function getRegisteredVariables(): VariableDefinition[] {
  return Array.from(definitionsById.values());
}

export function getVariableValue(id: string): number {
  const definition = definitionsById.get(id);
  if (definition === undefined) {
    return DEFAULT_VARIABLE_DEFAULT;
  }

  return variableValuesById.get(definition.id) ?? definition.default;
}

export function setVariableValue(id: string, value: number): number {
  const definition = definitionsById.get(id);
  if (definition === undefined) {
    return value;
  }

  const nextValue = clampValue(value, definition);
  variableValuesById.set(definition.id, nextValue);
  return nextValue;
}

function createDefinition(id: string, props: VariableProps): VariableDefinition {
  const min = props.min ?? DEFAULT_VARIABLE_MIN;
  const max = props.max ?? DEFAULT_VARIABLE_MAX;
  const normalizedMin = Math.min(min, max);
  const normalizedMax = Math.max(min, max);
  const increment =
    props.increment !== undefined && props.increment > 0
      ? props.increment
      : DEFAULT_VARIABLE_INCREMENT;

  const definition: VariableDefinition = {
    id,
    name: props.name ?? id,
    min: normalizedMin,
    max: normalizedMax,
    default: clampNumber(props.default ?? DEFAULT_VARIABLE_DEFAULT, normalizedMin, normalizedMax),
    increment,
  };
  definitionsById.set(id, definition);

  return definition;
}

function getNextVariableId(): string {
  const id = `var${nextVariableIndex}`;
  nextVariableIndex += 1;
  return id;
}

function loadPendingValues(): void {
  if (didLoadPendingValues) {
    return;
  }

  // Slider edits need to survive the reload that re-evaluates slide modules, but
  // should not become stale state that follows later code changes.
  variableValuesById = new Map(Object.entries(loadPendingVariableValues()));
  didLoadPendingValues = true;
}

function clampValue(value: number, definition: VariableDefinition): number {
  return clampNumber(value, definition.min, definition.max);
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
