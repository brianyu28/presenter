/**
 * An example slide with three-dimensional content using Three.js.
 *
 * Three.js renders to a `canvas` element, so we need some way to render the
 * canvas in addition to the normal SVG content of the slide. Presenter.js
 * supports the notion of an "additional element" that gets rendered behind
 * the SVG content of the slide.
 *
 * Here, we set the additional content to be a function that returns a new
 * Three.js canvas element. That canvas element draws state from a static
 * `StateContainer`, whose values can be animated with `animateStateChange`.
 */

import * as THREE from "three";
const GLTFLoader = require("three/examples/jsm/loaders/GLTFLoader.js");

import { animateStateChange, Slide, StateContainer, Text } from "presenter";

interface ThreeDimensionalSceneState {
  x: number;
  rotationY: number;
}

export default class ThreeDimensionalSlide extends Slide {
  static initialState: ThreeDimensionalSceneState = { x: 0, rotationY: 0.7 };

  static stateContainer: StateContainer<ThreeDimensionalSceneState> = {
    state: ThreeDimensionalSlide.initialState,
  };

  constructor() {
    const text = new Text("Presenter.js supports 3D!", {
      position: { x: 0.5, y: 0.2 },
      anchor: "center",
      fontSize: 150,
    });
    const stateContainer = ThreeDimensionalSlide.stateContainer;
    super(
      [text],
      [
        animateStateChange(stateContainer, { x: 5, rotationY: 4 }),
        [
          animateStateChange(stateContainer, { x: 2 }),
          animateStateChange(stateContainer, { rotationY: 8 }),
        ],
      ],
      {
        additionalElement: ThreeDimensionalSlide.createScene,
      },
    );
  }

  static createScene(): HTMLCanvasElement {
    // Ensure state is reset every time the scene is created anew
    ThreeDimensionalSlide.stateContainer.state = {
      ...ThreeDimensionalSlide.initialState,
    };

    // Create 3D scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(10, 16 / 9, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(3840, 2160);

    // Add object
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Add light
    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(50, 200, 100);
    light.position.multiplyScalar(1.3);
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    scene.add(light);

    // Add object
    const loader = new GLTFLoader.GLTFLoader();
    loader.load("/assets/cake.glb", function (gltf: any) {
      const object = gltf.scene;
      object.position.x = -5;
      object.rotation.x = 0.7;
      scene.add(object);
    });

    camera.position.z = 50;

    // Add line
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-2, 0, 0),
      new THREE.Vector3(0, 2, 0),
      new THREE.Vector3(2, 0, 0),
    ]);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);

    // Function to be called on each redraw
    function animate() {
      cube.rotation.y = ThreeDimensionalSlide.stateContainer.state.rotationY;
      cube.rotation.z = 0.3;
      cube.position.x = ThreeDimensionalSlide.stateContainer.state.x;
      renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animate);

    // Get element
    return renderer.domElement;
  }
}
