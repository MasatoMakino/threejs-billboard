import { BillBoardPlane } from "../bin/";
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
  const billboard = new BillBoardPlane("./map01.png", 0.1);
  billboard.cameraChaser.isLookingCameraHorizontal = true;
  scene.add(billboard);

  const billboard2 = new BillBoardPlane("./map01.png", 0.1);
  billboard2.position.set(-30, 0, 0);
  billboard2.cameraChaser.isLookingCameraHorizontal = true;
  scene.add(billboard2);
};

window.onload = onDomContentsLoaded;
