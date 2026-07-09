import type * as Three from "three";

import { collectObjectPaths, getPresenterId, modelPathToString } from "./modelPaths";

export interface ThreeModelNodeInfo {
  readonly name: string;
  readonly path: readonly string[];
  readonly pathString: string;
  readonly type: string;
  readonly isMesh: boolean;
  readonly isBone: boolean;
  readonly presenterId: string | null;
  readonly materialNames: readonly string[];
}

export interface ThreeModelMaterialInfo {
  readonly name: string;
  readonly presenterId: string | null;
  readonly meshPaths: readonly string[];
}

export interface ThreeModelInspection {
  readonly src: string;
  readonly nodes: readonly ThreeModelNodeInfo[];
  readonly materials: readonly ThreeModelMaterialInfo[];
}

export function inspectThreeModelScene(src: string, scene: Three.Object3D): ThreeModelInspection {
  const materialInfoByMaterial = new Map<Three.Material, ThreeModelMaterialInfo>();

  const nodes = collectObjectPaths(scene).map(({ object, path }) => {
    const materials = isMesh(object)
      ? Array.isArray(object.material)
        ? object.material
        : [object.material]
      : [];
    const materialNames = materials.map((material) => material.name);

    for (const material of materials) {
      const existingInfo = materialInfoByMaterial.get(material);
      const meshPath = modelPathToString(path);
      if (existingInfo === undefined) {
        materialInfoByMaterial.set(material, {
          name: material.name,
          presenterId: getPresenterId(material),
          meshPaths: [meshPath],
        });
      } else {
        materialInfoByMaterial.set(material, {
          ...existingInfo,
          meshPaths: [...existingInfo.meshPaths, meshPath],
        });
      }
    }

    return {
      name: object.name,
      path,
      pathString: modelPathToString(path),
      type: object.type,
      isMesh: isMesh(object),
      isBone: isBone(object),
      presenterId: getPresenterId(object),
      materialNames,
    };
  });

  return {
    src,
    nodes,
    materials: [...materialInfoByMaterial.values()],
  };
}

export function logThreeModelInspection(inspection: ThreeModelInspection): void {
  const title = `ThreeModel ${inspection.src}`;
  const logger = console.groupCollapsed ?? console.group;
  logger.call(console, title);
  console.table(
    inspection.nodes.map((node) => ({
      path: node.pathString,
      name: node.name,
      type: node.type,
      presenterId: node.presenterId,
      materials: node.materialNames.join(", "),
    })),
  );
  console.table(
    inspection.materials.map((material) => ({
      name: material.name,
      presenterId: material.presenterId,
      meshes: material.meshPaths.join(", "),
    })),
  );
  console.groupEnd?.();
}

function isMesh(object: Three.Object3D): object is Three.Mesh {
  return "isMesh" in object && object.isMesh === true;
}

function isBone(object: Three.Object3D): object is Three.Bone {
  return "isBone" in object && object.isBone === true;
}
