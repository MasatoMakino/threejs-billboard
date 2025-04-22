import * as PIXI from "pixi.js";
import * as THREE from "three";
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
  const billboard = new MultiViewPixiPlaneMesh(pixiManager, 200, 100);
  scene.add(billboard);
  billboard.cameraChaser.isLookingCameraHorizontal = true;
  billboard.scale.set(0.1, 0.1, 1); // Scale the billboard

  // Add some content to the billboard's PixiJS container
  const graphics = new PIXI.Graphics().rect(0, 0, 200, 100).fill(0xff0000);
  const text = new PIXI.Text({
    text: "Hello MultiView!",
    style: { fill: 0xffffff },
  });
  text.position.set(10, 10);
  billboard.container.addChild(graphics);
  billboard.container.addChild(text);
  billboard.updateContent();

  // Position the billboard in the Three.js scene
  billboard.position.set(30, 0, 0);

  // Example of updating billboard content after a delay
  setTimeout(() => {
    console.log("Updating billboard content...");
    billboard.container.removeChildren();

    const graphics2 = new PIXI.Graphics().rect(0, 0, 200, 100).fill(0x0000ff);
    const text2 = new PIXI.Text({
      text: "Updated!",
      style: { fill: 0xffffff },
    });
    text2.position.set(50, 40);
    billboard.container.addChild(graphics2);
    billboard.container.addChild(text2);
    billboard.updateContent();
  }, 3000);
};
