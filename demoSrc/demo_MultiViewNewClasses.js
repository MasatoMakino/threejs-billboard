import { Graphics, Text } from "pixi.js";
import { MultiViewPixiPlaneMesh, PixiMultiViewManager } from "../esm/index.js";
import { initSceneSet } from "./common.js";

window.onload = async () => {
  const w = 800;
  const h = 600;
  const scene = initSceneSet(w, h);

  // Create PixiMultiViewManager
  const pixiManager = new PixiMultiViewManager();
  await pixiManager.init();

  // Create a MultiViewPixiPlaneMesh instance
  const billboard = generateBillboard(pixiManager, 64, 1);
  billboard.position.set(30, 0, 0);
  scene.add(billboard);

  const billboard2 = generateBillboard(pixiManager, 64, 2);
  billboard2.position.set(-30, 0, 0);
  scene.add(billboard2);
};

const generateBillboard = (pixiManager, r, index) => {
  const billboard = new MultiViewPixiPlaneMesh(pixiManager, r * 2, r * 2);
  billboard.cameraChaser.isLookingCameraHorizontal = true;
  billboard.setScale(0.1);

  const graphics = new Graphics().circle(r, r, r).fill(0xff0000);
  const text = new Text({
    text: "Hello MultiView!",
    style: { fill: 0xffffff },
  });
  text.position.set(10, 10);
  billboard.container.addChild(graphics);
  billboard.container.addChild(text);
  billboard.updateContent();

  // Example of updating billboard content after a delay
  setTimeout(() => {
    billboard.container.removeChildren();

    const color = Math.random() * 0xffffff;
    const graphics2 = new Graphics().circle(r, r, r).fill(color);

    const text2 = new Text({
      text: "Updated!",
      style: { fill: 0xffffff },
    });
    text2.position.set(50, 40);
    billboard.container.addChild(graphics2);
    billboard.container.addChild(text2);
    billboard.updateContent();
  }, 3000);

  return billboard;
};
