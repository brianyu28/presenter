import { BoxGeometry, Mesh, MeshStandardMaterial, Object3D } from "three";

import { inspectThreeModelScene } from "./modelInspection";

describe("modelInspection", () => {
  test("returns node and material names with hierarchy paths", () => {
    const scene = new Object3D();
    scene.name = "Character";
    const headMaterial = new MeshStandardMaterial({ name: "Skin" });
    headMaterial.userData.presenterId = "skin-material";
    const head = new Mesh(new BoxGeometry(), headMaterial);
    head.name = "Head";
    head.userData.presenterId = "character-head";
    scene.add(head);

    const inspection = inspectThreeModelScene("/character.glb", scene);

    expect(inspection.nodes).toEqual([
      {
        name: "Character",
        path: ["Character"],
        pathString: "Character",
        type: "Object3D",
        isMesh: false,
        isBone: false,
        presenterId: null,
        materialNames: [],
      },
      {
        name: "Head",
        path: ["Character", "Head"],
        pathString: "Character/Head",
        type: "Mesh",
        isMesh: true,
        isBone: false,
        presenterId: "character-head",
        materialNames: ["Skin"],
      },
    ]);
    expect(inspection.materials).toEqual([
      {
        name: "Skin",
        presenterId: "skin-material",
        meshPaths: ["Character/Head"],
      },
    ]);
  });
});
