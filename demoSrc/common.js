"use strict";
import {
  AmbientLight,
  AxesHelper,
  Color,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export function initScene() {
  const scene = new Scene();
  return scene;
}

export function initLight(scene) {
  const ambientLight = new AmbientLight(0xffffff, 1.0);
  scene.add(ambientLight);
  return ambientLight;
}

export function initCamera(scene, W, H) {
  const camera = new PerspectiveCamera(45, W / H, 1, 400);
  camera.position.set(0, 0, 100);
  scene.add(camera);
  return camera;
}

export function initControl(camera) {
  const control = new OrbitControls(camera);
  control.update();
  return control;
}

export function initRenderer(W, H) {
  const renderOption = {
    canvas: document.getElementById("webgl-canvas"),
    antialias: true
  };
  const renderer = new WebGLRenderer(renderOption);
  renderer.setClearColor(new Color(0x000000));
  renderer.setSize(W, H);
  renderer.setPixelRatio(window.devicePixelRatio);
  return renderer;
}

export function initHelper(scene) {
  const axesHelper = new AxesHelper(30);
  scene.add(axesHelper);
}

export function render(control, renderer, scene, camera) {
  const rendering = () => {
    control.update();
    renderer.render(scene, camera);
    requestAnimationFrame(rendering);
  };
  rendering();
}
