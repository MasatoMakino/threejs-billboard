import { BillBoard } from "../bin/index";
import {
  initScene,
  initLight,
  initCamera,
  initControl,
  initRenderer,
  initHelper,
  render
} from "./common";
import { LinearMipMapLinearFilter } from "three";

const W = 640;
const H = 480;

const onDomContentsLoaded = () => {
  const scene = initScene();
  initLight(scene);
  const camera = initCamera(scene, W, H);
  const renderer = initRenderer(W, H);
  const control = initControl(camera, renderer);
  initHelper(scene);
  initBillBoard(scene);
  render(control, renderer, scene, camera);
};

const initBillBoard = scene => {
  const billboard = new BillBoard("./map01.png", 0.1);
  scene.add(billboard);

  const billboard2 = new BillBoard("./map01.png", 0.1);
  billboard.position.set(-30, 0, 0);
  scene.add(billboard2);
};

window.onload = onDomContentsLoaded;
