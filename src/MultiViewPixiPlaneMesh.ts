import * as THREE from "three";
import * as PIXI from "pixi.js";
import { PixiMultiViewManager } from "./PixiMultiViewManager";
import { IRenderablePixiView } from "./RenderablePixiView"; // Import the interface

export class MultiViewPixiPlaneMesh
  extends THREE.Mesh
  implements IRenderablePixiView
{
  // Implement the interface
  private _isDisposed: boolean = false;
  private _canvas: HTMLCanvasElement;
  private _container: PIXI.Container;
  private _texture: THREE.CanvasTexture;
  private _manager: PixiMultiViewManager;

  get isDisposed(): boolean {
    return this._isDisposed;
  }

  get container(): PIXI.Container {
    return this._container;
  }

  constructor(manager: PixiMultiViewManager, width: number, height: number) {
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({ transparent: true });

    super(geometry, material);

    this._manager = manager;
    this._canvas = document.createElement("canvas");
    this._canvas.width = width;
    this._canvas.height = height;

    this._container = new PIXI.Container();

    this._texture = new THREE.CanvasTexture(this._canvas);
    this._texture.colorSpace = "srgb";
    (this.material as THREE.MeshBasicMaterial).map = this._texture;

    this._manager.requestRender(this);
  }

  updateContent(): void {
    if (this._isDisposed) {
      console.warn("Attempted to update disposed MultiViewPixiPlaneMesh.");
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
    (this.material as THREE.MeshBasicMaterial).map?.dispose();
    // Handle material disposal for both single material and array of materials
    if (Array.isArray(this.material)) {
      for (const mat of this.material) {
        mat.dispose();
      }
    } else {
      this.material.dispose();
    }

    // Dispose PixiJS resources (container itself doesn't need explicit dispose in this context, but its children might)
    // Assuming children will be managed by the user of the class

    // Remove canvas from DOM if it was added (though in this plan, it's not added to DOM)
    if (this._canvas.parentNode) {
      this._canvas.parentNode.removeChild(this._canvas);
    }

    // TODO: Notify manager about disposal
  }
}
