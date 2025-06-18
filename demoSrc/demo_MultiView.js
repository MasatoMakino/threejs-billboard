import { Graphics, Text } from "pixi.js";
import {
  MultiViewPixiBillboard,
  MultiViewPixiPlaneMesh,
  PixiMultiViewManager,
} from "../esm/index.js";
import { initSceneSet } from "./common.js";

window.onload = async () => {
  const w = 800;
  const h = 600;
  const scene = initSceneSet(w, h);

  // Create PixiMultiViewManager
  const pixiManager = new PixiMultiViewManager();
  await pixiManager.init();

  // Create a MultiViewPixiPlaneMesh instance
  // Create 16 MultiViewPixiPlaneMesh instances
  for (let i = 0; i < 16; i++) {
    const planeMesh = generatePlaneMesh(pixiManager, 64, i + 1);
    const x = (i % 4) * 20 - 30; // 4x4グリッドのx座標
    const y = Math.floor(i / 4) * 20 - 30; // 4x4グリッドのy座標
    const z = 0; // z座標は固定
    planeMesh.position.set(x, y, z);
    planeMesh.cameraChaser.needUpdateWorldPosition = true;
    scene.add(planeMesh);
  }

  // Create 16 MultiViewPixiBillboard instances
  for (let i = 0; i < 16; i++) {
    const billboard = generateBillboard(pixiManager, 64, i + 1);
    const x = (i % 4) * 20 - 30; // 4x4グリッドのx座標
    const y = Math.floor(i / 4) * 20 - 30; // 4x4グリッドのy座標
    const z = -50; // z座標はオフセット
    billboard.position.set(x, y, z);
    scene.add(billboard);
  }
};

const drawContent = (container, r, initialText, billboad) => {
  const graphics = new Graphics().circle(r, r, r).fill(0xff0000);
  const text = new Text({
    text: initialText,
    style: { fill: 0xffffff },
  });
  text.position.set(10, 10);
  container.addChild(graphics);
  container.addChild(text);

  setTimeout(() => {
    container.removeChildren();

    const color = Math.random() * 0xffffff;
    const graphics2 = new Graphics().circle(r, r, r).fill(color);

    const text2 = new Text({
      text: "Updated!",
      style: { fill: 0xffffff },
    });
    text2.position.set(50, 40);
    container.addChild(graphics2);
    container.addChild(text2);
    billboad.updateContent();
  }, 3000);
};

const generatePlaneMesh = (pixiManager, r) => {
  const billboard = new MultiViewPixiPlaneMesh({
    manager: pixiManager,
    width: r * 2,
    height: r * 2,
  });
  billboard.cameraChaser.isLookingCameraHorizontal = true;
  drawContent(billboard.container, r, "Hello MultiView!", billboard);
  billboard.updateContent();
  return billboard;
};

const generateBillboard = (pixiManager, r) => {
  const billboard = new MultiViewPixiBillboard({
    manager: pixiManager,
    width: r * 2,
    height: r * 2,
  });
  drawContent(billboard.container, r, "Billboard", billboard);
  billboard.updateContent();
  return billboard;
};
