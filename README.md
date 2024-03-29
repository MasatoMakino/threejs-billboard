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

## API documents

[API documents](https://masatomakino.github.io/threejs-billboard/api/)

## License

[MIT licensed](LICENSE).
