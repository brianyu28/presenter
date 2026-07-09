export type ThreeModelPath = string | readonly string[];

export interface ThreeModelTarget {
  /** Match a Blender/glTF node or material by exported name. */
  readonly name: string | null;

  /** Match a node by a slash-delimited or array suffix through the model hierarchy. */
  readonly path: ThreeModelPath | null;

  /** Match a node or material by a custom Blender property exported to glTF extras. */
  readonly presenterId: string | null;
}
