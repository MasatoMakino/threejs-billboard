import { StageBillBoard } from "../bin/index";
import {
  initScene,
  initLight,
  initCamera,
  initControl,
  initRenderer,
  initHelper,
  render,
  initSceneSet
} from "./common";

const W = 640;
const H = 480;

const onDomContentsLoaded = () => {
  const scene = initSceneSet(W, H);
  initBillBoard(scene);
};

const initBillBoard = scene => {
  const canvasBoard = new StageBillBoard(320, 320, 0.1);
  canvasBoard.position.set(15, 0, 0);
  scene.add(canvasBoard);

  const text = new createjs.Text("Hello World", "48px Arial", "#ff7700");
  canvasBoard.stage.addChild(text);
  text.x = 20;
  text.y = 160;
  canvasBoard.setNeedUpdate();
};

window.onload = onDomContentsLoaded;
