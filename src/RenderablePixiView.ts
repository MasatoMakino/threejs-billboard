import type { Texture } from "three";
import type { Container } from "pixi.js";

export interface IRenderablePixiView {
  isDisposed: boolean;
  container: Container;
  canvas: HTMLCanvasElement;
  texture: Texture;
  // Add other common properties or methods if needed in the future
}
