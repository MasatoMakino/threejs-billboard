# threejs-billboard

billboard module for three.js

[Github repository](https://github.com/MasatoMakino/threejs-billboard)

## Demo

[Demo : Billboard](https://masatomakino.github.io/threejs-billboard/demo/)

[Demo : Sprite with canvas](https://masatomakino.github.io/threejs-billboard/demo/canvasBillboard.html)

[Demo : PlaneMesh with canvas](https://masatomakino.github.io/threejs-billboard/demo/canvasPlaneMesh.html)

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
  CanvasBillBoard,
  CanvasPlaneMesh,
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
billboard.imageScale = calc.getDotByDotScale(billboard);
``` 

## API documents

[API documents](https://masatomakino.github.io/threejs-billboard/api/)

## License

threejs-billboard is [MIT licensed](LICENSE).