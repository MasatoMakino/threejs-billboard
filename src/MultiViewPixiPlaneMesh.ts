import { Container } from "pixi.js";
import {
  CanvasTexture,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  type Texture,
} from "three";
import { CameraChaser } from "./CameraChaser.js";
import { MultiViewObject3DUtils } from "./MultiViewObject3DUtils.js";
import type { MultiViewPixiObjectOptions } from "./MultiViewPixiObjectOptions.js";
import type { PixiMultiViewManager } from "./PixiMultiViewManager";
import type { IRenderablePixiView } from "./RenderablePixiView";

/**
 * Configuration options for MultiViewPixiPlaneMesh constructor.
 *
 * This interface extends MultiViewPixiObjectOptions to provide configuration
 * for plane mesh-specific features and behaviors.
 */
interface MultiViewPixiPlaneMeshOptions extends MultiViewPixiObjectOptions {
  // Plane mesh-specific options can be added here in the future
}

/**
 * Plane mesh class that uses PixiJS v8 multiView functionality for independent Canvas rendering.
 *
 * This class extends Three.js Mesh and maintains its own HTMLCanvasElement and PixiJS Container.
 * Rendering management is handled by PixiMultiViewManager, and camera following functionality
 * is provided through CameraChaser.
 *
 * ## Comparison with SharedStage Classes
 *
 * Compared to SharedStagePlaneMesh, MultiViewPixiPlaneMesh provides each instance with
 * an independent Canvas, offering performance advantages when partial content updates
 * are frequent. It also handles dynamic plane mesh counts more flexibly.
 *
 * However, SharedStagePlaneMesh uses a single shared Canvas via SharedStageTexture,
 * allowing texture and material instances to be shared across multiple plane meshes for reduced draw calls,
 * though it has Canvas size limitations that may cause texture mapping failures with many meshes.
 *
 * **Best Use Cases:**
 * MultiViewPixiPlaneMesh is ideal when you have many plane meshes that update
 * frequently and independently, or when the required number of plane meshes
 * varies dynamically.
 *
 * @example
 * ```typescript
 * // Initialize manager
 * const manager = new PixiMultiViewManager();
 * await manager.init();
 *
 * // Create plane mesh with independent canvas
 * const planeMesh = new MultiViewPixiPlaneMesh({
 *   manager: manager,
 *   width: 512,
 *   height: 512,
 *   scale: 1.0
 * });
 *
 * // Add content to the PixiJS container
 * const graphics = new Graphics();
 * graphics.rect(0, 0, 100, 100).fill(0xff0000);
 * planeMesh.container.addChild(graphics);
 *
 * // Enable camera following (optional)
 * planeMesh.cameraChaser.enabled = true;
 *
 * // Update content and request re-render
 * planeMesh.updateContent();
 *
 * scene.add(planeMesh);
 * ```
 */
export class MultiViewPixiPlaneMesh
  extends Mesh
  implements IRenderablePixiView
{
  /**
   * Flag indicating whether this instance has been disposed.
   */
  private _isDisposed = false;
  /**
   * Gets whether this instance has been disposed.
   *
   * @returns True if the plane mesh has been disposed
   */
  get isDisposed(): boolean {
    return this._isDisposed;
  }

  /**
   * The HTMLCanvasElement associated with this plane mesh.
   */
  private _canvas: HTMLCanvasElement;
  /**
   * Gets the HTMLCanvasElement associated with this plane mesh.
   *
   * This canvas serves as both the PixiJS render target and the source
   * for the Three.js texture applied to the plane mesh.
   *
   * @returns The canvas element for this plane mesh instance
   */
  get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  /**
   * The PixiJS Container associated with this plane mesh.
   */
  private _container: Container;
  /**
   * Gets the PixiJS Container associated with this plane mesh.
   *
   * This container is the root display object for PixiJS content.
   * External access is allowed for adding/removing children, but the
   * container reference itself should not be overwritten.
   *
   * @returns The PixiJS container for content management
   */
  get container(): Container {
    return this._container;
  }

  /**
   * The Three.js CanvasTexture associated with this plane mesh.
   */
  private _texture: CanvasTexture;
  /**
   * Gets the Three.js Texture associated with this plane mesh.
   *
   * This texture references the HTMLCanvasElement and is automatically updated
   * by PixiMultiViewManager when the canvas content changes through PixiJS rendering.
   *
   * @returns The texture used by the plane mesh
   */
  get texture(): Texture {
    return this._texture;
  }

  /**
   * The PixiMultiViewManager instance that manages this plane mesh.
   */
  private _manager: PixiMultiViewManager;
  /**
   * The CameraChaser instance that manages camera following for this plane mesh.
   */
  private _cameraChaser: CameraChaser | undefined;
  /**
   * Gets the CameraChaser instance for this plane mesh.
   *
   * The CameraChaser enables Y-axis camera following functionality.
   * Use this to control whether the plane mesh should rotate to follow the camera.
   *
   * @returns The CameraChaser instance, or undefined if disposed
   */
  get cameraChaser(): CameraChaser | undefined {
    return this._cameraChaser;
  }

  /**
   * Creates a new MultiViewPixiPlaneMesh instance.
   *
   * The constructor initializes the plane mesh with its own canvas, PixiJS container,
   * Three.js texture, and CameraChaser. It automatically registers with the provided
   * manager for rendering coordination.
   *
   * @param options - Constructor options including manager, dimensions, and scale
   *
   * @example
   * ```typescript
   * const manager = new PixiMultiViewManager();
   * await manager.init();
   *
   * const planeMesh = new MultiViewPixiPlaneMesh({
   *   manager: manager,
   *   width: 512,
   *   height: 512,
   *   scale: 1.0
   * });
   * ```
   */
  constructor(options: MultiViewPixiPlaneMeshOptions) {
    const { manager, width, height, scale = 0.1 } = options;

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

    this._cameraChaser = new CameraChaser(this);

    this.setScale(scale);
    this._manager.requestRender(this);
  }

  /**
   * Sets the plane mesh scale factor.
   *
   * This method updates the plane mesh size in the Three.js scene based on
   * the provided scale factor. Unlike billboards, this affects the mesh
   * uniformly in X, Y, and Z dimensions.
   *
   * @param scale - The scale factor to apply to the plane mesh
   *
   * @example
   * ```typescript
   * // Make plane mesh twice as large
   * planeMesh.setScale(2.0);
   * ```
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

  /**
   * Notifies the manager that plane mesh content has been updated and requests re-rendering.
   *
   * Call this method after modifying the PixiJS container content to ensure
   * the changes are rendered to the canvas and reflected in the Three.js scene.
   *
   * @example
   * ```typescript
   * // Add new content to the container
   * const graphics = new Graphics();
   * graphics.rect(50, 50, 100, 100).fill(0x00ff00);
   * planeMesh.container.addChild(graphics);
   *
   * // Request re-render to show changes
   * planeMesh.updateContent();
   * ```
   */
  updateContent(): void {
    if (this._isDisposed) {
      console.warn("Attempted to update disposed MultiViewPixiPlaneMesh.");
      return;
    }
    this._manager.requestRender(this);
  }

  /**
   * Releases all resources held by this plane mesh instance.
   *
   * This method properly disposes of the geometry, materials, PixiJS container,
   * canvas element, CameraChaser, and removes the plane mesh from its parent in the scene.
   * Call this when the plane mesh is no longer needed to prevent memory leaks.
   *
   * @example
   * ```typescript
   * // Clean up when plane mesh is no longer needed
   * planeMesh.dispose();
   * ```
   */
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

    this._cameraChaser?.dispose();
    this._cameraChaser = undefined;
  }
}
