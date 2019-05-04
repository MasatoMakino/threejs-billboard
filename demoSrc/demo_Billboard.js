import { BillBoard } from "../bin/index";

import {
  AmbientLight,
  Color,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const W = 1920;
const H = 1080;
let renderer;
let scene;
let camera;
let control;

const onDomContentsLoaded = () => {
  initScene();
  initControl();
  initBillBoard();
  render();
};

const initScene = () => {
  scene = new Scene();
  camera = new PerspectiveCamera(45, W / H, 1, 400);
  camera.position.set(0, 0, 100);
  scene.add(camera);

  const renderOption = {
    canvas: document.getElementById("webgl-canvas"),
    antialias: true
  };
  renderer = new WebGLRenderer(renderOption);
  renderer.setClearColor(new Color(0x000000));
  renderer.setSize(W, H);
  renderer.setPixelRatio(window.devicePixelRatio);

  const ambientLight = new AmbientLight(0xffffff, 1.0);
  scene.add(ambientLight);
};

const initControl = () => {
  control = new OrbitControls(camera);
  control.update();
};

const initBillBoard = () => {
  const billboard = new BillBoard("./map01.png", 0.1);
  scene.add(billboard);

  const billboard2 = new BillBoard("./map01.png", 0.1);
  billboard.position.set(-30, 0, 0);
  scene.add(billboard2);
};

const render = () => {
  control.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
};
window.onload = onDomContentsLoaded;
