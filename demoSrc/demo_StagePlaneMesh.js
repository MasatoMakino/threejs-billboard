import { StagePlaneMesh } from "../bin/index";
import {
  initScene,
  initLight,
  initCamera,
  initControl,
  initRenderer,
  initHelper,
  render
} from "./common";

const W = 640;
const H = 480;

const onDomContentsLoaded = () => {
  const scene = initScene();
  initLight(scene);
  const camera = initCamera(scene, W, H);
  const renderer = initRenderer(W, H);
  const control = initControl(camera);
  initHelper(scene);
  initBillBoard(scene);
  render(control, renderer, scene, camera);
};

const initBillBoard = scene => {
  const mesh = new StagePlaneMesh(320, 320);
  mesh.position.set(-0, 0, 0);
  scene.add(mesh);
  mesh.scale.set(0.05, 0.05, 1);

  const map = mesh.material.map;
  const stage = map.stage;
  const shape = new createjs.Shape();
  shape.graphics
    .beginFill("#F00")
    .drawRect(0, 0, 320, 320)
    .endFill();
  stage.addChild(shape);
  const text = new createjs.Text("Hello World", "48px Arial", "#ff7700");
  stage.addChild(text);
  text.x = 20;
  text.y = 160;

  map.setNeedUpdate();

  // mesh.setVisible(false);
};

window.onload = onDomContentsLoaded;
