import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as PIXI from "pixi.js";
import { PixiMultiViewManager, MultiViewPixiBillboard } from "../esm/index.js";

window.onload = async () => {
  const w = 800;
  const h = 600;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);

  // Get the canvas element created by the demo page generator
  const canvas = document.getElementById("webgl-canvas"); // Remove type assertion
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setSize(w, h);
  // No need to append to body, it's already there

  const controls = new OrbitControls(camera, renderer.domElement);
  camera.position.z = 500;

  // Create PixiMultiViewManager
  const pixiManager = new PixiMultiViewManager();
  await pixiManager.init(); // Initialize the PixiJS renderer

  // Create a MultiViewPixiBillboard instance
  const billboard = new MultiViewPixiBillboard(pixiManager, 200, 800); // width, height in PixiJS pixels
  scene.add(billboard);

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
  billboard.position.set(0, 0, 0);

  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate);

    // Update controls
    controls.update();

    // Render Three.js scene
    renderer.render(scene, camera);
  };

  animate();

  // Handle window resize
  //   window.addEventListener("resize", () => {
  //     camera.aspect = window.innerWidth / window.innerHeight;
  //     camera.updateProjectionMatrix();
  //     renderer.setSize(window.innerWidth, window.innerHeight);
  //   });

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

  document.body.appendChild(pixiManager.renderer.canvas);
  document.body.appendChild(billboard.canvas);

  //   document.body.appendChild(
};
