import { BillBoardPlane } from "../esm/index.js";
import { initSceneSet } from "./common.js";
import map01Url from "./map01.png";

const W = 640;
const H = 480;

const onDomContentsLoaded = () => {
  const scene = initSceneSet(W, H);
  initBillBoard(scene);
};

const initBillBoard = (scene) => {
  const billboard = new BillBoardPlane(map01Url, 0.1);
  billboard.cameraChaser.isLookingCameraHorizontal = true;
  scene.add(billboard);

  const billboard2 = new BillBoardPlane(map01Url, 0.1);
  billboard2.position.set(-30, 0, 0);
  billboard2.cameraChaser.isLookingCameraHorizontal = true;
  scene.add(billboard2);
};

window.onload = onDomContentsLoaded;
