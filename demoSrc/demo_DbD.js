import { BillBoard, ScaleCalculator } from "../bin/index";
import {
  initScene,
  initLight,
  initCamera,
  initControl,
  initRenderer,
  initHelper
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
  const calc = initScaleCalc(camera, renderer);
  initBillBoard(scene, renderer, camera);
  render(control, renderer, scene, camera, calc);
};

const initScaleCalc = (camera, renderer) => {
  const calc = new ScaleCalculator(camera, renderer);
  return calc;
};

const initBillBoard = scene => {
  billboard = new BillBoard("./map01.png", 0.1);
  billboard.position.set(-40, 0, 0);
  scene.add(billboard);

  billboard2 = new BillBoard("./map01.png", 0.1);
  scene.add(billboard2);
};

export function render(control, renderer, scene, camera, calc) {
  const rendering = () => {
    control.update();
    calc.updatePlane(camera);
    billboard.imageScale = calc.getDotByDotScale(billboard);
    billboard2.imageScale = calc.getDotByDotScale(billboard2);

    renderer.render(scene, camera);
    requestAnimationFrame(rendering);
  };
  rendering();
}

window.onload = onDomContentsLoaded;
