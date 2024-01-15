import { SharedStagePlaneMesh, SharedStageTexture } from "../esm/index.js";
import { initSceneSet, initSharedStageTextureGUI } from "./common.js";
import { Text, Sprite } from "pixi.js";
import GUI from "lil-gui";
import { MeshBasicMaterial } from "three";

const W = 640;
const H = 480;

const onDomContentsLoaded = () => {
  const scene = initSceneSet(W, H);
  initBillBoards(scene);
};

const initShardTexture = () => {
  const texture = new SharedStageTexture(1024, 1024);
  const sprite = Sprite.from("./uv_grid_opengl.jpg");
  texture.stage.addChild(sprite);
  const onload = () => {
    texture.setNeedUpdate();
  };
  sprite.texture.baseTexture.once("loaded", onload);
  if (sprite.texture.baseTexture.hasLoaded) {
    onload();
  }

  const text = new Text("Hello World", {
    fontSize: 48,
    fontFamily: "Arial",
    fill: "#ff7700",
  });

  texture.stage.addChild(text);
  text.x = 256;
  text.y = 256 + 60;
  texture.setNeedUpdate();

  return texture;
};

const initBillBoards = (scene) => {
  const texture = initShardTexture();
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
