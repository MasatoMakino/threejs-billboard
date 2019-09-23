import { BillBoard, ScaleCalculator } from "../bin/index";
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

let billboard;
let billboard2;

const onDomContentsLoaded = () => {
  const scene = initScene();
  initLight(scene);
  const camera = initCamera(scene, W, H);
  const renderer = initRenderer(W, H);
  const control = initControl(camera);
  initHelper(scene);
  const calc = initScaleCalc(camera, renderer, scene);
  initBillBoard(scene, calc);
  render(control, renderer, scene, camera);
};

const initScaleCalc = (camera, renderer, scene) => {
  const calc = new ScaleCalculator(camera, renderer, scene);
  return calc;
};

const initBillBoard = (scene, calc) => {
  const scale = calc.getNonAttenuateScale();

  billboard = new BillBoard("./map01.png", scale);
  billboard.position.set(-40, 0, 0);
  scene.add(billboard);
  billboard.material.sizeAttenuation = false;

  billboard2 = new BillBoard("./map01.png", scale);
  scene.add(billboard2);
  billboard2.material.sizeAttenuation = false;
};

window.onload = onDomContentsLoaded;
