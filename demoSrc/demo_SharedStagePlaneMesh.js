import GUI from "lil-gui";
import { MeshBasicMaterial } from "three";
import { SharedStagePlaneMesh } from "../esm/index.js";
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

const initBillBoards = async (scene) => {
  const texture = await initSharedTexture();
  const material = new MeshBasicMaterial({
    map: texture,
    transparent: true,
  });

  const canvasBoard = initPlane(scene, 30, material);
  const canvasBoard2 = initPlane(scene, -30, material);

  const gui = new GUI();
  initSharedStageTextureGUI(gui, canvasBoard, "board 01");
  initSharedStageTextureGUI(gui, canvasBoard2, "board 02");
};

const initPlane = (scene, positionX, material) => {
  const canvasBoard = new SharedStagePlaneMesh(material, {
    x: 256,
    y: 256,
    width: 256,
    height: 256,
  });
  canvasBoard.position.set(positionX, 0, 0);
  canvasBoard.scale.set(0.1, 0.1, 0.1);
  canvasBoard.cameraChaser.isLookingCameraHorizontal = true;
  scene.add(canvasBoard);
  return canvasBoard;
};

window.onload = onDomContentsLoaded;
