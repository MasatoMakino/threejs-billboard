import {
  CanvasTexture,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Texture,
} from "three";
import { Container } from "pixi.js";
import { PixiMultiViewManager } from "./PixiMultiViewManager";
import { IRenderablePixiView } from "./RenderablePixiView";
import { CameraChaser } from "./CameraChaser.js";
import { MultiViewObject3DUtils } from "./MultiViewObject3DUtils";

export class MultiViewPixiPlaneMesh
  extends Mesh
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
  private _cameraChaser: CameraChaser | undefined; // Add CameraChaser property
  get cameraChaser(): CameraChaser | undefined {
    return this._cameraChaser;
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

    this._cameraChaser = new CameraChaser(this); // Initialize CameraChaser

    this._manager.requestRender(this);
  }

  /**
   * Sets the scale of the mesh.
   *
   * @param scale The scale factor to apply.
   * @returns void
   */
  setScale(scale: number): void {
    if (this._isDisposed) {
      console.warn(
        "Attempted to set scale on disposed MultiViewPixiPlaneMesh.",
      );
      return;
    }
    this.scale.set(scale, scale, 1);
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

    this.geometry.dispose();
    MultiViewObject3DUtils.disposeMaterials(this.material as MeshBasicMaterial);
    MultiViewObject3DUtils.disposeStageContainer(this._container);
    MultiViewObject3DUtils.disposeCanvas(this._canvas);
    this.removeFromParent();

    this._cameraChaser?.dispose(); // Dispose CameraChaser safely
    this._cameraChaser = undefined;
  }
}
