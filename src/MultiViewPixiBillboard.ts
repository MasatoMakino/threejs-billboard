import { Container } from "pixi.js";
import { CanvasTexture, Sprite, type Texture, SpriteMaterial } from "three";
import type { PixiMultiViewManager } from "./PixiMultiViewManager.js";
import type { IRenderablePixiView } from "./RenderablePixiView";
import { MultiViewObject3DUtils } from "./MultiViewObject3DUtils.js";
import type { MultiViewPixiObjectOptions } from "./MultiViewPixiObjectOptions.js";

/**
 * Configuration options for MultiViewPixiBillboard constructor.
 *
 * This interface extends MultiViewPixiObjectOptions to provide configuration
 * for billboard-specific features and behaviors.
 */
interface MultiViewPixiBillboardOptions extends MultiViewPixiObjectOptions {
  // Billboard-specific options can be added here in the future
}

/**
 * Billboard class that uses PixiJS v8 multiView functionality for independent Canvas rendering.
 *
 * This class extends Three.js Sprite and maintains its own HTMLCanvasElement and PixiJS Container.
 * Rendering management is handled by PixiMultiViewManager.
 *
 * ## Comparison with SharedStage Classes
 *
 * Compared to SharedStageBillboard, MultiViewPixiBillboard provides each instance with
 * an independent Canvas, offering performance advantages when partial content updates
 * are frequent. It also handles dynamic billboard counts more flexibly.
 *
 * However, SharedStageBillboard uses a single shared Canvas via SharedStageTexture,
 * allowing texture and material instances to be shared across multiple billboards for reduced draw calls,
 * though it has Canvas size limitations that may cause texture mapping failures with many billboards.
 *
 * **Best Use Cases:**
 * MultiViewPixiBillboard is ideal when you have many billboards that update
 * frequently and independently, or when the required number of billboards
 * varies dynamically.
 *
 * @example
 * ```typescript
 * // Initialize manager
 * const manager = new PixiMultiViewManager();
 * await manager.init();
 *
 * // Create billboard with independent canvas
 * const billboard = new MultiViewPixiBillboard({
 *   manager: manager,
 *   width: 512,
 *   height: 512,
 *   scale: 1.0
 * });
 *
 * // Add content to the PixiJS container
 * const text = new Text({ text: 'Hello World', style: { fill: 'white' } });
 * billboard.container.addChild(text);
 *
 * // Update content and request re-render
 * billboard.updateContent();
 *
 * scene.add(billboard);
 * ```
 */
export class MultiViewPixiBillboard
  extends Sprite
  implements IRenderablePixiView
{
  /**
   * Flag indicating whether this instance has been disposed.
   */
  private _isDisposed = false;
  /**
   * Gets whether this instance has been disposed.
   *
   * @returns True if the billboard has been disposed
   */
  get isDisposed(): boolean {
    return this._isDisposed;
  }

  /**
   * The HTMLCanvasElement associated with this billboard.
   */
  private _canvas: HTMLCanvasElement;
  /**
   * Gets the HTMLCanvasElement associated with this billboard.
   *
   * This canvas serves as both the PixiJS render target and the source
   * for the Three.js texture applied to the billboard sprite.
   *
   * @returns The canvas element for this billboard instance
   */
  get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  /**
   * The PixiJS Container associated with this billboard.
   */
  private _container: Container;
  /**
   * Gets the PixiJS Container associated with this billboard.
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
   * The Three.js CanvasTexture associated with this billboard.
   */
  private _texture: CanvasTexture;
  /**
   * Gets the Three.js Texture associated with this billboard.
   *
   * This texture references the HTMLCanvasElement and is automatically updated
   * by PixiMultiViewManager when the canvas content changes through PixiJS rendering.
   *
   * @returns The texture used by the billboard sprite
   */
  get texture(): Texture {
    return this._texture;
  }
  /**
   * The PixiMultiViewManager instance that manages this billboard.
   */
  private _manager: PixiMultiViewManager;

  /**
   * Creates a new MultiViewPixiBillboard instance.
   *
   * The constructor initializes the billboard with its own canvas, PixiJS container,
   * and Three.js texture. It automatically registers with the provided manager
   * for rendering coordination.
   *
   * @param options - Constructor options including manager, dimensions, and scale
   *
   * @example
   * ```typescript
   * const manager = new PixiMultiViewManager();
   * await manager.init();
   *
   * const billboard = new MultiViewPixiBillboard({
   *   manager: manager,
   *   width: 512,
   *   height: 512,
   *   scale: 1.0
   * });
   * ```
   */
  constructor(options: MultiViewPixiBillboardOptions) {
    const { manager, width, height, scale = 0.1 } = options;

    const material = new SpriteMaterial({ transparent: true, depthTest: true });

    super(material);
    this._manager = manager;
    this._canvas = document.createElement("canvas");
    this._canvas.width = width;
    this._canvas.height = height;

    this._container = new Container();
    this._texture = new CanvasTexture(this._canvas);
    this._texture.colorSpace = "srgb";
    (this.material as SpriteMaterial).map = this._texture;

    this.scale.set(scale * width, scale * height, 1);

    this._manager.requestRender(this);
  }

  /**
   * Sets the billboard scale factor.
   *
   * This method updates the billboard size in the Three.js scene based on
   * the canvas dimensions and the provided scale factor.
   *
   * @param scale - The scale factor to apply to the billboard
   *
   * @example
   * ```typescript
   * // Make billboard twice as large
   * billboard.setScale(2.0);
   * ```
   */
  setScale(scale: number): void {
    if (this._isDisposed) {
      console.warn(
        "Attempted to set scale on disposed MultiViewPixiBillboard.",
      );
      return;
    }
    this.scale.set(scale * this._canvas.width, scale * this._canvas.height, 1);
    this._manager.requestRender(this);
  }

  /**
   * Notifies the manager that billboard content has been updated and requests re-rendering.
   *
   * Call this method after modifying the PixiJS container content to ensure
   * the changes are rendered to the canvas and reflected in the Three.js scene.
   *
   * @example
   * ```typescript
   * // Add new content to the container
   * const sprite = new Sprite(texture);
   * billboard.container.addChild(sprite);
   *
   * // Request re-render to show changes
   * billboard.updateContent();
   * ```
   */
  updateContent(): void {
    if (this._isDisposed) {
      console.warn("Attempted to update disposed MultiViewPixiBillboard.");
      return;
    }
    this._manager.requestRender(this);
  }

  /**
   * Releases all resources held by this billboard instance.
   *
   * This method properly disposes of the geometry, materials, PixiJS container,
   * canvas element, and removes the billboard from its parent in the scene.
   * Call this when the billboard is no longer needed to prevent memory leaks.
   *
   * @example
   * ```typescript
   * // Clean up when billboard is no longer needed
   * billboard.dispose();
   * ```
   */
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
