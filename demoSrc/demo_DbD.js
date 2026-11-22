import { BillBoard, ScaleCalculator } from "../esm/index.js";
import * as THREE from "three";
import map01Url from "./map01.png";
import {
  initScene,
  initLight,
  initCamera,
  initControl,
  initRenderer,
  initHelper,
  render,
} from "./common.js";

const W = 640;
const H = 480;

let billboard;
let billboard2;

const onDomContentsLoaded = () => {
  const scene = initScene();
  initLight(scene);
  const camera = initCamera(scene, W, H);
  const renderer = initRenderer(W, H);
  const control = initControl(camera, renderer);
  initHelper(scene);
  initBillBoard(scene, renderer, camera);
  render(control, renderer, scene, camera);
};

const initBillBoard = (scene, renderer, camera) => {
  const scale = ScaleCalculator.getNonAttenuateScale(
    renderer.getSize(new THREE.Vector2()).height,
    camera,
  );

  billboard = new BillBoard(map01Url, scale);
  billboard.position.set(-40, 0, 0);
  scene.add(billboard);
  billboard.material.sizeAttenuation = false;

  billboard2 = new BillBoard(map01Url, scale);
  scene.add(billboard2);
  billboard2.material.sizeAttenuation = false;
};

window.onload = onDomContentsLoaded;
