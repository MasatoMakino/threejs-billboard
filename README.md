# threejs-billboard

> billboard module for three.js

[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)
[![Test Coverage](https://api.codeclimate.com/v1/badges/5e46ba2a716da782e45e/test_coverage)](https://codeclimate.com/github/MasatoMakino/threejs-billboard/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/5e46ba2a716da782e45e/maintainability)](https://codeclimate.com/github/MasatoMakino/threejs-billboard/maintainability)

[![ReadMe Card](https://github-readme-stats.vercel.app/api/pin/?username=MasatoMakino&repo=threejs-billboard&show_owner=true)](https://github.com/MasatoMakino/threejs-billboard)

## Demo

[Demo page](https://masatomakino.github.io/threejs-billboard/demo/)

## Getting Started

### Install

```bash
npm install @masatomakino/threejs-billboard --save-dev
```

threejs-billboard depend on [three.js](https://threejs.org/) and [pixi.js](https://github.com/pixijs/pixi.js).

### Import

threejs-billboard is composed of ES6 modules and TypeScript d.ts files.

At first, import classes.

```js
import {
  BillBoard,
  StageBillBoard,
  StagePlaneMesh,
  ScaleCalculator,
} from "@masatomakino/threejs-billboard";
```

### Show billboard

Add billboard in [THREE.Scene](https://threejs.org/docs/#manual/en/introduction/Creating-a-scene).

```js
const billboard = new BillBoard("./map01.png", 0.1);
scene.add(billboard);
```

### Choosing the Right Class

The library provides different classes for creating billboards and plane meshes, each with distinct characteristics and use cases:

- **Image-based Classes (BillBoard, BillBoardPlane):** Use image files as source. Simple to use for static images.
- **SharedStage Classes (Billboard, PlaneMesh):** Utilize a single shared Canvas/Texture, excelling in reducing draw calls. Suitable for scenarios with a fixed number of billboards where performance is critical.
- **MultiView Classes (Billboard, PlaneMesh):** Each instance has an independent Canvas, offering superior performance for partial updates and flexibility in the number of billboards. Suitable for scenarios with numerous and dynamically changing billboards.

### Dot-by-dot display

If you want to display dot-by-dot billboard, get image scale with ScaleCalculator.

```js
const scale = ScaleCalculator.getNonAttenuateScale(
  renderer.getSize(new THREE.Vector2()).height,
  camera,
);
const billboard = new BillBoard("./map01.png", scale);
billboard.material.sizeAttenuation = false;
```

### Camera Chaser

The `CameraChaser` utility can be used with `SharedStagePlaneMesh`, `MultiViewPixiPlaneMesh`, and `BillBoardPlane` to make the plane track the camera's rotation. By default, this feature is off. You can enable it to make the plane always face the camera, similar to a billboard but maintaining its plane geometry. Note that unlike a Sprite, the rotation is limited to the Y-axis.

## API documents

[API documents](https://masatomakino.github.io/threejs-billboard/api/)

## License

[MIT licensed](LICENSE).
