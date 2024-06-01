"use strict";
import {
  AmbientLight,
  AxesHelper,
  Color,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  REVISION,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { SharedStageTexture } from "../esm/index.js";
import { Assets, RendererType, Sprite, Text, sayHello } from "pixi.js";

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
  camera.updateMatrixWorld(false);
  scene.add(camera);
  return camera;
}

export function initControl(camera, render) {
  const control = new OrbitControls(camera, render.domElement);
  control.update();
  return control;
}

export function initRenderer(W, H) {
  const renderOption = {
    canvas: document.getElementById("webgl-canvas"),
    antialias: true,
  };
  const renderer = new WebGLRenderer(renderOption);
  console.log("Three.js rev :", REVISION);
  renderer.setClearColor(new Color(0x000000));
  renderer.setSize(W, H);
  renderer.setPixelRatio(window.devicePixelRatio);
  return renderer;
}

export function initHelper(scene) {
  const axesHelper = new AxesHelper(30);
  scene.add(axesHelper);
}

export function initSceneSet(W, H) {
  const scene = initScene();
  initLight(scene);
  const camera = initCamera(scene, W, H);
  const renderer = initRenderer(W, H);
  const control = initControl(camera, renderer);
  initHelper(scene);
  render(control, renderer, scene, camera);
  return scene;
}

export function render(control, renderer, scene, camera) {
  const rendering = () => {
    control.update();
    renderer.render(scene, camera);
    requestAnimationFrame(rendering);
  };
  rendering();
}

export const initSharedStageTextureGUI = (gui, object3D, name) => {
  const target = object3D.cloneTextureArea();
  const onUpdate = () => {
    object3D.updateTextureAreaAndUV(target);
  };
  const folder = gui.addFolder(name);
  folder.add(target, "x", 0, 1024, 1).onChange(onUpdate);
  folder.add(target, "y", 0, 1024, 1).onChange(onUpdate);
  folder.add(target, "width", 0, 1024, 1).onChange(onUpdate);
  folder.add(target, "height", 0, 1024, 1).onChange(onUpdate);
};

export const initSharedTexture = async () => {
  const texture = new SharedStageTexture();
  await texture.init(1024, 1024);

  await Assets.load("./uv_grid_opengl.jpg");
  const sprite = Sprite.from("./uv_grid_opengl.jpg");
  texture.stage.addChild(sprite);

  const text = new Text({
    text: "Hello World",
    style: {
      fontSize: 48,
      fontFamily: "Arial",
      fill: "#ff7700",
    },
  });

  texture.stage.addChild(text);
  text.x = 256;
  text.y = 256 + 60;
  texture.setNeedUpdate();

  sayHello(RendererType[texture.app.renderer.type]);

  return texture;
};
