import { CanvasTexture, Mesh, MeshBasicMaterial, PlaneGeometry } from "three";
import { PixiMultiViewManager } from "./PixiMultiViewManager.js";
import { IRenderablePixiView } from "./RenderablePixiView";
import { Container } from "pixi.js";

export class MultiViewPixiBillboard
  extends Mesh
  implements IRenderablePixiView
{
  private _isDisposed: boolean = false;
  get canvas(): HTMLCanvasElement {
    return this._canvas;
  }
  private _canvas: HTMLCanvasElement;
  private _container: Container;
  private _texture: CanvasTexture;
  private _manager: PixiMultiViewManager;

  get isDisposed(): boolean {
    return this._isDisposed;
  }

  get container(): Container {
    return this._container;
  }

  constructor(manager: PixiMultiViewManager, width: number, height: number) {
    const geometry = new PlaneGeometry(width, height);
    const material = new MeshBasicMaterial({ transparent: true });

    super(geometry, material);

    this._manager = manager;
    this._canvas = document.createElement("canvas");
    this._canvas.width = width;
    this._canvas.height = height;

    this._container = new Container();
    this._texture = new CanvasTexture(this._canvas);
    this._texture.colorSpace = "srgb";
    (this.material as MeshBasicMaterial).map = this._texture;

    // Request initial render from manager
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

    // Dispose Three.js resources
    this.geometry.dispose();

    // Handle material disposal for both single material and array of materials
    const disposeMaterial = (material: MeshBasicMaterial) => {
      material.map?.dispose();
      material.dispose();
    };
    if (Array.isArray(this.material)) {
      for (const mat of this.material) {
        disposeMaterial(mat as MeshBasicMaterial);
      }
    } else {
      disposeMaterial(this.material as MeshBasicMaterial);
    }

    // Dispose PixiJS resources
    this._container.removeFromParent();
    this._container.destroy({ children: true }); // Destroy the container and its children

    // Remove canvas from DOM if it was added (though in this plan, it's not added to DOM)
    if (this._canvas.parentNode) {
      this._canvas.parentNode.removeChild(this._canvas);
    }
  }
}
