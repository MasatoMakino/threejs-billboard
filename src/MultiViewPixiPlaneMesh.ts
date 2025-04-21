import {
  CanvasTexture,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Texture,
} from "three";
import { Container } from "pixi.js";
import { PixiMultiViewManager } from "./PixiMultiViewManager";
import { IRenderablePixiView } from "./RenderablePixiView"; // Import the interface
import { CameraChaser } from "./CameraChaser.js"; // Import CameraChaser

export class MultiViewPixiPlaneMesh
  extends Mesh
  implements IRenderablePixiView
{
  // Implement the interface
  private _isDisposed: boolean = false;
  private _canvas: HTMLCanvasElement;
  private _container: Container;
  private _texture: CanvasTexture; // Three.js texture
  private _manager: PixiMultiViewManager;
  private cameraChaser: CameraChaser | undefined; // Add CameraChaser property

  get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  get texture(): Texture {
    return this._texture;
  }

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

    this.cameraChaser = new CameraChaser(this); // Initialize CameraChaser

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
    (this.material as MeshBasicMaterial).map?.dispose();
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

    this.cameraChaser?.dispose(); // Dispose CameraChaser safely
    this.parent?.removeFromParent(); // Remove from parent if exists
  }
}
