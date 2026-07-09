import type * as Three from "three";

import { ThreeModelPath, ThreeModelTarget } from "../objects/ThreeModelTarget";

export interface ObjectPath {
  readonly object: Three.Object3D;
  readonly path: readonly string[];
}

export function collectObjectPaths(root: Three.Object3D): ObjectPath[] {
  const paths: ObjectPath[] = [];

  function visit(object: Three.Object3D, parentPath: readonly string[]) {
    const path = object === root && object.name === "" ? parentPath : [...parentPath, object.name];
    if (object !== root || object.name !== "") {
      paths.push({ object, path });
    }
    for (const child of object.children) {
      visit(child, path);
    }
  }

  visit(root, []);
  return paths;
}

export function normalizeModelPath(path: ThreeModelPath): readonly string[] {
  return typeof path === "string" ? path.split("/").filter((part) => part !== "") : path;
}

export function modelPathToString(path: readonly string[]): string {
  return path.join("/");
}

export function modelTargetToString(target: ThreeModelTarget | Omit<ThreeModelTarget, "path">) {
  if ("path" in target && target.path !== null) {
    return `path "${modelPathToString(normalizeModelPath(target.path))}"`;
  }
  if (target.presenterId !== null) {
    return `presenterId "${target.presenterId}"`;
  }
  if (target.name !== null) {
    return `name "${target.name}"`;
  }
  return "empty target";
}

export function objectPathMatches(path: readonly string[], targetPath: ThreeModelPath): boolean {
  const normalizedTargetPath = normalizeModelPath(targetPath);
  if (normalizedTargetPath.length > path.length) {
    return false;
  }

  const offset = path.length - normalizedTargetPath.length;
  return normalizedTargetPath.every((part, index) => path[offset + index] === part);
}

export function getPresenterId(object: { userData?: Record<string, unknown> }): string | null {
  const id = object.userData?.presenterId ?? object.userData?.presenterID;
  return typeof id === "string" ? id : null;
}
