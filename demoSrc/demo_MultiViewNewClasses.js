import * as PIXI from "pixi.js";
import * as THREE from "three";
import { AxesHelper } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { MultiViewPixiPlaneMesh, PixiMultiViewManager } from "../esm/index.js";

window.onload = async () => {
  const w = 800;
  const h = 600;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);

  const canvas = document.getElementById("webgl-canvas"); // Remove type assertion
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setSize(w, h);

  const controls = new OrbitControls(camera, renderer.domElement);
  camera.position.z = 500;

  // Add AxesHelper
  const axesHelper = new AxesHelper(300);
  scene.add(axesHelper);

  // Create PixiMultiViewManager
  const pixiManager = new PixiMultiViewManager();
  await pixiManager.init();

  // Create a MultiViewPixiPlaneMesh instance
  const billboard = new MultiViewPixiPlaneMesh(pixiManager, 200, 100);
  scene.add(billboard);
  billboard.cameraChaser.isLookingCameraHorizontal = true;

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
  billboard.position.set(300, 0, 0);

  // Animation loop
  const animate = () => {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };
  animate();

  // Example of updating billboard content after a delay
  setTimeout(() => {
    console.log("Updating billboard content...");
    // Clear existing content
    billboard.container.removeChildren();

    // Add new content
    const graphics2 = new PIXI.Graphics().rect(0, 0, 200, 100).fill(0x0000ff);
    const text2 = new PIXI.Text({
      text: "Updated!",
      style: { fill: 0xffffff },
    });
    text2.position.set(50, 40);
    billboard.container.addChild(graphics2);
    billboard.container.addChild(text2);
    billboard.updateContent();
  }, 3000); // Update after 3 seconds

  // Example of disposing the billboard after a delay
  // setTimeout(() => {
  //     billboard.dispose();
  //     scene.remove(billboard);
  //     console.log('Billboard disposed and removed from scene.');
  // }, 6000); // Dispose after 6 seconds
};
