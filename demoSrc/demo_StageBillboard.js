import { StageBillBoard } from "../bin/index";
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
  const canvasBoard = new StageBillBoard(320, 320, 0.1);
  canvasBoard.position.set(15, 0, 0);
  scene.add(canvasBoard);

  const map = canvasBoard.material.map;
  const stage = map.stage;
  const text = new createjs.Text("Hello World", "48px Arial", "#ff7700");
  stage.addChild(text);
  text.x = 20;
  text.y = 160;

  map.setNeedUpdate();
};

window.onload = onDomContentsLoaded;
