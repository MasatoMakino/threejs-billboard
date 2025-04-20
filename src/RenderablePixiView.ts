import * as PIXI from "pixi.js";

export interface IRenderablePixiView {
  isDisposed: boolean;
  container: PIXI.Container;
  // Add other common properties or methods if needed in the future
}
