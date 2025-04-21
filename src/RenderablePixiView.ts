import { Texture } from "three";
import { Container } from "pixi.js";

export interface IRenderablePixiView {
  isDisposed: boolean;
  container: Container;
  canvas: HTMLCanvasElement;
  texture: Texture;
  // Add other common properties or methods if needed in the future
}
