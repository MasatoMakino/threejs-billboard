import GUI from "lil-gui";
import { SpriteMaterial } from "three";
import { SharedStageBillboard } from "../esm/index.js";
import {
  initSceneSet,
  initSharedTexture,
  initSharedStageTextureGUI,
} from "./common.js";

const W = 640;
const H = 480;

const onDomContentsLoaded = () => {
  const scene = initSceneSet(W, H);
  initBillBoards(scene);
};

const initBillBoards = (scene) => {
  const texture = initSharedTexture();
  const material = new SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
  });

  const canvasBoard = initPlane(scene, 30, material);
  const canvasBoard2 = initPlane(scene, -30, material);

  const gui = new GUI();
  initSharedStageTextureGUI(gui, canvasBoard, "board 01");
  initSharedStageTextureGUI(gui, canvasBoard2, "board 02");
};

const initPlane = (scene, positionX, material) => {
  const canvasBoard = new SharedStageBillboard(
    material,
    { x: 256, y: 256, width: 256, height: 256 },
    0.1,
  );
  canvasBoard.position.set(positionX, 0, 0);
  scene.add(canvasBoard);
  return canvasBoard;
};

window.onload = onDomContentsLoaded;
