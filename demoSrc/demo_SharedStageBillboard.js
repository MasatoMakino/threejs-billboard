import { SharedStageBillboard, SharedStageTexture } from "../esm/index.js";
import { initSceneSet } from "./common.js";
import { Text, Sprite } from "pixi.js";
import GUI from "lil-gui";

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

  const canvasBoard = initPlane(scene, 30, texture);
  const canvasBoard2 = initPlane(scene, -30, texture);

  const gui = new GUI();
  initGUI(gui, canvasBoard, "board 01");
  initGUI(gui, canvasBoard2, "board 02");

  canvasBoard2.updateTextureAreaAndUV({ x: 0, y: 0, width: 512, height: 512 });
};

const initPlane = (scene, positionX, texture) => {
  const canvasBoard = new SharedStageBillboard(
    texture,
    { x: 256, y: 256, width: 256, height: 256 },
    0.1,
  );
  canvasBoard.position.set(positionX, 0, 0);
  scene.add(canvasBoard);
  return canvasBoard;
};

const initGUI = (gui, billboard, name) => {
  const target = billboard.cloneTextureArea();
  const onUpdate = () => {
    billboard.updateTextureAreaAndUV(target);
  };
  const folder = gui.addFolder(name);
  folder.add(target, "x", 0, 1024, 1).onChange(onUpdate);
  folder.add(target, "y", 0, 1024, 1).onChange(onUpdate);
  folder.add(target, "width", 0, 1024, 1).onChange(onUpdate);
  folder.add(target, "height", 0, 1024, 1).onChange(onUpdate);
};

window.onload = onDomContentsLoaded;
