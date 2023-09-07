import { StagePlaneMesh } from "../esm/index.js";
import { initSceneSet } from "./common.js";
import { Graphics, Text } from "pixi.js";

const W = 640;
const H = 480;

const onDomContentsLoaded = () => {
  const scene = initSceneSet(W, H);
  initBillBoard(scene);
};

const initBillBoard = (scene) => {
  const initMesh = (x, y, z) => {
    const mesh = new StagePlaneMesh(320, 320);
    mesh.position.set(x, y, z);
    scene.add(mesh);
    mesh.scale.set(0.05, 0.05, 1);
    initMap(mesh);
    return mesh;
  };

  initMesh(-20, 0, 0);
  const mesh = initMesh(20, 0, 0);
  mesh.cameraChaser.isLookingCameraHorizontal = true;
};

const initMap = (mesh) => {
  const shape = new Graphics();
  shape.beginFill(0xff0000).drawRect(0, 0, 320, 320).endFill();
  mesh.stage.addChild(shape);
  const text = new Text("Hello World", {
    fontSize: 48,
    fontFamily: "Arial",
    fill: "#ff7700",
  });
  mesh.stage.addChild(text);
  text.x = 20;
  text.y = 160;

  mesh.setNeedUpdate();
};

window.onload = onDomContentsLoaded;
