import { Container } from "pixi.js";
import { CanvasTexture, Sprite, Texture, SpriteMaterial } from "three";
import { PixiMultiViewManager } from "./PixiMultiViewManager.js";
import { IRenderablePixiView } from "./RenderablePixiView";
import { MultiViewObject3DUtils } from "./MultiViewObject3DUtils.js";

export class MultiViewPixiBillboard
  extends Sprite
  implements IRenderablePixiView
{
  private _isDisposed: boolean = false;
  get isDisposed(): boolean {
    return this._isDisposed;
  }

  private _canvas: HTMLCanvasElement;
  get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  private _container: Container;
  get container(): Container {
    return this._container;
  }

  private _texture: CanvasTexture; // Three.js texture
  get texture(): Texture {
    return this._texture;
  }
  private _manager: PixiMultiViewManager;

  constructor(
    manager: PixiMultiViewManager,
    width: number,
    height: number,
    scale: number = 0.01,
  ) {
    const material = new SpriteMaterial({ transparent: true, depthTest: true });

    super(material);
    this._manager = manager;
    this._canvas = document.createElement("canvas");
    this._canvas.width = width;
    this._canvas.height = height;

    this._container = new Container();
    this._texture = new CanvasTexture(this._canvas); // Create Three.js texture
    this._texture.colorSpace = "srgb";
    (this.material as SpriteMaterial).map = this._texture;

    this.scale.set(scale * width, scale * height, 1); // Set the scale of the sprite

    this._manager.requestRender(this);
  }

  updateContent(): void {
    if (this._isDisposed) {
      console.warn("Attempted to update disposed MultiViewPixiBillboard.");
      return;
    }
    this._manager.requestRender(this);
  }

  dispose(): void {
    if (this._isDisposed) {
      return;
    }
    this._isDisposed = true;

    this.geometry.dispose();
    MultiViewObject3DUtils.disposeMaterials(this.material);
    MultiViewObject3DUtils.disposeStageContainer(this._container);
    MultiViewObject3DUtils.disposeCanvas(this._canvas);
    this.removeFromParent();
  }
}
