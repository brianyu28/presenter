import { Object3D } from "three";

import {
  collectObjectPaths,
  getPresenterId,
  modelPathToString,
  objectPathMatches,
} from "./modelPaths";

describe("modelPaths", () => {
  test("collects hierarchy paths and matches path suffixes", () => {
    const root = new Object3D();
    root.name = "Character";
    const armature = new Object3D();
    armature.name = "Armature";
    const head = new Object3D();
    head.name = "Head";
    root.add(armature);
    armature.add(head);

    const paths = collectObjectPaths(root);
    expect(paths.map((path) => modelPathToString(path.path))).toEqual([
      "Character",
      "Character/Armature",
      "Character/Armature/Head",
    ]);
    expect(objectPathMatches(["Character", "Armature", "Head"], "Armature/Head")).toBe(true);
    expect(objectPathMatches(["Character", "Armature", "Head"], ["Character", "Head"])).toBe(false);
  });

  test("reads presenterId from glTF extras user data", () => {
    const object = new Object3D();
    object.userData.presenterId = "character-head";

    expect(getPresenterId(object)).toBe("character-head");
  });
});
