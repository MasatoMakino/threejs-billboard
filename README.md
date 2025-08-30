# threejs-billboard

> Billboard module for three.js with multiple rendering approaches

[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

[![ReadMe Card](https://github-readme-stats.vercel.app/api/pin/?username=MasatoMakino&repo=threejs-billboard&show_owner=true)](https://github.com/MasatoMakino/threejs-billboard)

## Demo

[Demo page](https://masatomakino.github.io/threejs-billboard/demo/)

## Getting Started

### Install

```bash
npm install @masatomakino/threejs-billboard --save-dev
```

This library depends on [three.js](https://threejs.org/) (>=0.126.0) and [pixi.js](https://github.com/pixijs/pixi.js) (^8.4.0).

### Import

threejs-billboard is composed of ES6 modules and TypeScript d.ts files.

Import the classes you need:

```js
import {
  BillBoard,
  BillBoardPlane,
  SharedStageBillboard,
  SharedStagePlaneMesh,
  MultiViewPixiBillboard,
  MultiViewPixiPlaneMesh,
  ScaleCalculator,
  CameraChaser,
} from "@masatomakino/threejs-billboard";
```

### Basic Usage

Add a billboard to your [THREE.Scene](https://threejs.org/docs/#manual/en/introduction/Creating-a-scene):

```js
const billboard = new BillBoard("./map01.png", 0.1);
scene.add(billboard);
```

## Billboard Types

The library provides three distinct approaches for different use cases:

### 1. Image-based Classes

Simple billboards using image files directly as texture source.

```js
// Billboard that always faces the camera
const billboard = new BillBoard("./image.png", 0.1);
scene.add(billboard);

// Plane mesh with image texture
const plane = new BillBoardPlane("./image.png", 0.1);
scene.add(plane);
```

**Best for**: Static images, simple use cases

### 2. SharedStage Classes

Multiple billboards sharing a single Canvas/Texture for optimal performance.

```js
// Create shared stage texture
const sharedTexture = new SharedStageTexture(512, 512);

// Create billboards using shared texture
const billboard1 = new SharedStageBillboard(sharedTexture, 0.1);
const billboard2 = new SharedStageBillboard(sharedTexture, 0.1);

// Or plane meshes
const plane1 = new SharedStagePlaneMesh(sharedTexture, 0.1);
const plane2 = new SharedStagePlaneMesh(sharedTexture, 0.1);
```

**Best for**: Fixed number of billboards, reducing draw calls, performance-critical scenarios

### 3. MultiView Classes

Each instance has independent Canvas using PixiJS v8 multiView technology.

```js
// Create manager for multiview rendering
const manager = new PixiMultiViewManager();

// Create independent billboards
const billboard1 = new MultiViewPixiBillboard(manager, 0.1);
const billboard2 = new MultiViewPixiBillboard(manager, 0.1);

// Or plane meshes
const plane1 = new MultiViewPixiPlaneMesh(manager, 0.1);
const plane2 = new MultiViewPixiPlaneMesh(manager, 0.1);
```

**Best for**: Partial updates, flexible billboard count, dynamic scenarios

## Advanced Features

### Dot-by-dot Display

For pixel-perfect display without size attenuation:

```js
const scale = ScaleCalculator.getNonAttenuateScale(
  renderer.getSize(new THREE.Vector2()).height,
  camera,
);
const billboard = new BillBoard("./map01.png", scale);
billboard.material.sizeAttenuation = false;
```

### Camera Chaser

Make plane meshes track camera rotation (Y-axis only). CameraChaser is automatically created for all plane mesh classes - you don't need to instantiate it manually:

```js
const plane = new BillBoardPlane("./image.png", 0.1);

// Enable camera chasing (disabled by default)
plane.cameraChaser.isLookingCameraHorizontal = true;

// Disable camera chasing
plane.cameraChaser.isLookingCameraHorizontal = false;
```

Works with `SharedStagePlaneMesh`, `MultiViewPixiPlaneMesh`, and `BillBoardPlane`. No manual update calls needed - it automatically updates before each render.

## Development

### Build Commands

```bash
npm run build        # Build TypeScript and generate demo pages
npm run buildTS      # Compile TypeScript to ESM
npm test            # Run tests with Vitest
npm run test:watch  # Run tests in watch mode
npm run coverage    # Run tests with coverage
```

### Development Server

```bash
npm run start:dev   # Start development server with file watching
npm run server      # Start browser-sync server for demo pages
npm run demo        # Generate demo pages
```

## API Documentation

[API documents](https://masatomakino.github.io/threejs-billboard/api/)

## License

[MIT licensed](LICENSE).
