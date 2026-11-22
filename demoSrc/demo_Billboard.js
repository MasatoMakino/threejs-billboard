import { BillBoard } from "../esm/index.js";
import { initSceneSet } from "./common.js";
import map01Url from "./map01.png";

const W = 640;
const H = 480;

const onDomContentsLoaded = () => {
  const scene = initSceneSet(W, H);
  initBillBoard(scene);
};

const initBillBoard = (scene) => {
  const billboard = new BillBoard(map01Url, 0.1);
  scene.add(billboard);

  const billboard2 = new BillBoard(map01Url, 0.1);
  billboard.position.set(-30, 0, 0);
  scene.add(billboard2);
};

window.onload = onDomContentsLoaded;
