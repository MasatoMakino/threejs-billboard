# threejs-billboard

billboard module for three.js

[Github repository](https://github.com/MasatoMakino/threejs-billboard)

[![Maintainability](https://api.codeclimate.com/v1/badges/5e46ba2a716da782e45e/maintainability)](https://codeclimate.com/github/MasatoMakino/threejs-billboard/maintainability)
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

## Demo

[Demo : Billboard](https://masatomakino.github.io/threejs-billboard/demo/)

[Demo : Sprite with canvas](https://masatomakino.github.io/threejs-billboard/demo/stageBillboard.html)

[Demo : PlaneMesh with canvas](https://masatomakino.github.io/threejs-billboard/demo/stagePlaneMesh.html)

[Demo : Dot-by-dot billboard](https://masatomakino.github.io/threejs-billboard/demo/dotByDot.html)

## Getting Started

### Install

threejs-billboard depend on [three.js](https://threejs.org/) and [CreateJS / EaselJS](https://github.com/CreateJS/EaselJS).

```bash
npm install three easeljs --save-dev
```

and

```bash
npm install https://github.com/MasatoMakino/threejs-billboard.git --save-dev
```

### Import

threejs-billboard is composed of ES6 modules and TypeScript d.ts files.

At first, import classes.

```js
import {
  BillBoard,
  StageBillBoard,
  StagePlaneMesh,
  ScaleCalculator
} from "threejs-billboard";
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
const calc = new ScaleCalculator(camera, renderer, scene);
const billboard = new BillBoard("./map01.png");
billboard.material.sizeAttenuation = false;
billboard.imageScale = calc.getNonAttenuateScale();
``` 

## API documents

[API documents](https://masatomakino.github.io/threejs-billboard/api/)

## License

threejs-billboard is [MIT licensed](LICENSE).