import {
  autoDetectRenderer,
  type Container,
  Ticker,
  type WebGLRenderer,
} from "pixi.js";
import type { Texture } from "three";
import type { IRenderablePixiView } from "./RenderablePixiView";

/**
 * Configuration options for PixiMultiViewManager initialization.
 *
 * This interface defines the optional parameters that can be passed to the
 * PixiMultiViewManager constructor to customize its behavior.
 */
interface PixiMultiViewManagerOptions {
  /**
   * The PixiJS Ticker instance to use for the rendering loop.
   *
   * If not specified, `Ticker.shared` will be used. Providing a custom ticker
   * allows for fine-grained control over the rendering timing and integration
   * with existing application timing systems.
   *
   * @default Ticker.shared
   * @example
   * ```typescript
   * // Use custom ticker for controlled rendering
   * const customTicker = new Ticker();
   * const manager = new PixiMultiViewManager({ ticker: customTicker });
   * ```
   */
  ticker?: Ticker;
}

/**
 * Manages a single PixiJS v8 multiView renderer instance and coordinates rendering requests from multiple IRenderablePixiView instances.
 *
 * This class serves as the central coordinator for the MultiView billboard system, managing
 * rendering requests from MultiViewPixiBillboard and MultiViewPixiPlaneMesh instances.
 * It leverages PixiJS v8's multiView capability to efficiently render multiple independent
 * canvas elements using a single WebGL renderer.
 *
 * ## Architecture Overview
 *
 * Unlike the SharedStage approach which uses a single shared canvas and texture,
 * the MultiView system specializes in efficiently managing multiple independent
 * canvases and textures. This provides several advantages:
 *
 * - **Independent Updates**: Each billboard can be updated independently
 * - **Flexible Scaling**: Number of billboards can be dynamic
 * - **Resource Isolation**: Each billboard has its own canvas and texture
 * - **Optimized Rendering**: Single renderer handles multiple render targets
 *
 * ## Rendering Queue System
 *
 * The manager uses a queue-based approach where:
 * 1. MultiView instances request rendering via `requestRender()`
 * 2. Requests are queued until the next ticker frame
 * 3. All queued instances are rendered in a single batch
 * 4. Queue is cleared after processing
 *
 * ## Integration with MultiView Classes
 *
 * This manager is primarily used with:
 * - `MultiViewPixiBillboard`: Sprite-based billboards with independent canvas
 * - `MultiViewPixiPlaneMesh`: Mesh-based billboards with independent canvas
 *
 * @example
 * ```typescript
 * // Create and initialize the manager
 * const manager = new PixiMultiViewManager();
 * await manager.init();
 *
 * // Create billboards that will use this manager
 * const billboard1 = new MultiViewPixiBillboard({
 *   width: 256,
 *   height: 256,
 *   imageScale: 1.0,
 *   manager: manager
 * });
 * const billboard2 = new MultiViewPixiPlaneMesh({
 *   width: 512,
 *   height: 512,
 *   imageScale: 0.5,
 *   manager: manager
 * });
 *
 * // Billboards automatically request rendering when content changes
 * // The manager handles all rendering coordination
 *
 * // Clean up when done
 * manager.dispose();
 * ```
 */
export class PixiMultiViewManager {
  /**
   * Flag indicating whether this manager instance has been disposed.
   * Set to true during disposal to prevent further operations.
   */
  private _isDisposed = false;

  /**
   * Gets whether this manager instance has been disposed.
   *
   * When `true`, the manager's resources have been cleaned up and it should
   * no longer be used. All rendering operations will be ignored after disposal.
   *
   * @returns True if disposed, false otherwise
   * @example
   * ```typescript
   * if (!manager.isDisposed) {
   *   manager.requestRender(billboard);
   * }
   * ```
   */
  get isDisposed(): boolean {
    return this._isDisposed;
  }

  /**
   * Gets the managed PixiJS WebGLRenderer instance.
   *
   * The renderer is created during initialization and used to render all
   * MultiView instances. Returns null if the manager has not been initialized
   * or has been disposed.
   *
   * @returns The WebGL renderer instance, or null if not available
   * @example
   * ```typescript
   * const manager = new PixiMultiViewManager();
   * console.log(manager.renderer); // null - not initialized yet
   *
   * await manager.init();
   * console.log(manager.renderer); // WebGLRenderer instance
   * ```
   */
  get renderer(): WebGLRenderer | null {
    return this._renderer;
  }

  /**
   * The internal WebGL renderer instance used for rendering all MultiView instances.
   * Created during initialization and destroyed during disposal.
   */
  private _renderer: WebGLRenderer | null = null;

  /**
   * The PixiJS Ticker instance used for the rendering loop.
   * Either provided via options or defaults to Ticker.shared.
   */
  private _ticker: Ticker;

  /**
   * Queue of IRenderablePixiView instances that need rendering.
   * Instances are added via requestRender() and processed in batches during the render loop.
   */
  private _renderQueue: Set<IRenderablePixiView> = new Set();

  /**
   * Creates a new PixiMultiViewManager instance.
   *
   * The constructor sets up the basic configuration but does not initialize
   * the renderer. Call init() after construction to start the rendering system.
   *
   * @param options - Configuration options for the manager
   * @example
   * ```typescript
   * // Create with default options
   * const manager = new PixiMultiViewManager();
   *
   * // Create with custom ticker
   * const customTicker = new Ticker();
   * const manager = new PixiMultiViewManager({ ticker: customTicker });
   * ```
   */
  constructor(options?: PixiMultiViewManagerOptions) {
    this._ticker = options?.ticker ?? Ticker.shared;
  }

  /**
   * Asynchronously initializes the PixiJS renderer and starts the rendering loop.
   *
   * This method creates a WebGL renderer with multiView capability enabled and
   * starts the ticker-based rendering loop. The renderer is configured with
   * optimal settings for billboard rendering.
   *
   * ## Renderer Configuration
   *
   * - **MultiView enabled**: Supports rendering to multiple canvas targets
   * - **WebGL preference**: Uses WebGL for optimal performance
   * - **Transparent background**: Alpha 0.0 for proper compositing
   * - **Antialiasing enabled**: Smooth rendering for better visual quality
   *
   * @example
   * ```typescript
   * const manager = new PixiMultiViewManager();
   * await manager.init();
   *
   * // Manager is now ready to handle rendering requests
   * console.log(manager.renderer); // WebGLRenderer instance
   * ```
   */
  async init(): Promise<void> {
    if (this._renderer) {
      console.warn("PixiMultiViewManager already initialized.");
      return;
    }

    this._renderer = (await autoDetectRenderer({
      width: 1,
      height: 1,
      autoDensity: false,
      preference: "webgl",
      backgroundAlpha: 0.0,
      antialias: true,
      multiView: true,
    })) as WebGLRenderer;

    this._ticker.add(this._renderLoop, this);
    this._ticker.start();
  }

  /**
   * Requests rendering for the specified IRenderablePixiView instance.
   *
   * This method adds the instance to the render queue to be processed on the
   * next ticker frame. Multiple requests for the same instance within a single
   * frame are automatically deduplicated using a Set.
   *
   * ## Internal Usage Pattern
   *
   * This method is primarily called internally by MultiView billboard classes:
   * - **During construction**: Initial rendering request when the billboard is created
   * - **On content updates**: When `updateContent()` is called on the billboard
   * - **On property changes**: When properties like scale are modified via `setScale()`
   *
   * ## Queue Behavior
   *
   * - Instances are queued until the next ticker frame
   * - Duplicate requests are automatically ignored
   * - Disposed instances are automatically filtered out
   * - Queue is processed in batch for optimal performance
   *
   * @param instance - The renderable instance that needs updating
   * @example
   * ```typescript
   * // Typically called internally by billboard classes:
   * // - In constructor: this._manager.requestRender(this);
   * // - In updateContent(): this._manager.requestRender(this);
   * // - In setScale(): this._manager.requestRender(this);
   *
   * // Manual usage (if needed):
   * manager.requestRender(billboard);
   *
   * // Multiple requests in the same frame are deduplicated
   * manager.requestRender(billboard);
   * manager.requestRender(billboard); // Only rendered once
   * ```
   */
  requestRender(instance: IRenderablePixiView): void {
    if (instance.isDisposed) {
      return;
    }
    this._renderQueue.add(instance);
  }

  /**
   * Internal rendering loop that processes queued instances.
   *
   * This method is called automatically by the ticker on each frame to process
   * all instances in the render queue. It filters out disposed instances and
   * renders all remaining instances in a single batch operation.
   *
   * ## Processing Steps
   *
   * 1. Check if queue is empty or renderer is unavailable
   * 2. Remove any disposed instances from the queue
   * 3. Render all remaining instances in batch
   * 4. Clear the queue for the next frame
   *
   * **Note**: This is an internal method and should not be called directly.
   */
  private _renderLoop = (): void => {
    if (this._renderQueue.size === 0 || !this._renderer) {
      return;
    }

    for (const instance of this._renderQueue) {
      if (instance.isDisposed) {
        this._renderQueue.delete(instance);
      }
    }
    PixiMultiViewManager.renderAllQueued(this._renderQueue, this._renderer);
    this._renderQueue.clear();
  };

  /**
   * Ensures the renderer size is adequate for the target canvas dimensions.
   *
   * This internal utility method dynamically resizes the renderer to accommodate
   * the largest canvas dimensions encountered during rendering. This ensures that
   * all canvas targets can be rendered without clipping or scaling issues.
   *
   * ## Sizing Strategy
   *
   * - Takes the maximum of current renderer dimensions and target canvas dimensions
   * - Only resizes when necessary to avoid unnecessary operations
   * - Ensures renderer is always large enough for all render targets
   *
   * @param renderer - The PixiJS WebGL renderer to resize
   * @param targetCanvas - The canvas that needs to be rendered to
   */
  private static ensureRendererSize(
    renderer: WebGLRenderer,
    targetCanvas: HTMLCanvasElement,
  ): void {
    const w = Math.max(renderer.width, targetCanvas.width);
    const h = Math.max(renderer.height, targetCanvas.height);
    if (renderer.width !== w || renderer.height !== h) {
      renderer.resize(w, h);
    }
  }

  /**
   * Renders the specified PixiJS container to the target canvas and updates the Three.js texture.
   *
   * This method performs the core rendering operation for MultiView instances by:
   * 1. Clearing the target canvas with transparent pixels
   * 2. Rendering the PixiJS container to the canvas using multiView capability
   * 3. Marking the Three.js texture for update
   *
   * ## Canvas Clearing Behavior
   *
   * The target canvas is cleared using the 2D context's `clearRect` method, which
   * fills with black transparent pixels (RGBA: 0,0,0,0). This is the standard
   * behavior for 2D canvas contexts.
   *
   * ## Alpha Handling Notes
   *
   * - Canvas 2D context does not support premultiplied alpha
   * - If black edges appear on textures, adjust the material's `alphaTest` property
   * - Consider values smaller than the default 0.0 for `alphaTest`
   *
   * @param renderer - The PixiJS WebGL renderer to use
   * @param targetCanvas - The HTML canvas to render to
   * @param targetTexture - The Three.js texture to mark for update
   * @param container - The PixiJS container to render
   *
   * @see {@link https://html.spec.whatwg.org/multipage/canvas.html#premultiplied-alpha-and-the-2d-rendering-context | Canvas 2D Premultiplied Alpha}
   * @see {@link https://threejs.org/docs/#api/en/materials/Material.alphaTest | Three.js Material.alphaTest}
   *
   * @example
   * ```typescript
   * // This method is called internally by the manager
   * // No direct usage required in application code
   * PixiMultiViewManager.renderToTargetCanvas(
   *   renderer,
   *   billboard.canvas,
   *   billboard.texture,
   *   billboard.container
   * );
   * ```
   */
  private static renderToTargetCanvas(
    renderer: WebGLRenderer,
    targetCanvas: HTMLCanvasElement,
    targetTexture: Texture,
    container: Container,
  ): void {
    if (!renderer || !targetCanvas || !targetTexture) {
      return;
    }

    targetCanvas
      .getContext("2d")
      ?.clearRect(0, 0, targetCanvas.width, targetCanvas.height);

    renderer.render({
      container: container,
      target: targetCanvas,
    });
    targetTexture.needsUpdate = true;
  }

  /**
   * Renders all instances in the render queue in a single batch operation.
   *
   * This static method processes all queued instances by ensuring the renderer
   * is appropriately sized and then rendering each instance to its target canvas.
   * Disposed instances are automatically skipped during processing.
   *
   * ## Batch Processing Benefits
   *
   * - Single renderer handles multiple render targets
   * - Automatic renderer sizing for optimal performance
   * - Efficient processing of multiple instances
   * - Automatic filtering of disposed instances
   *
   * @param renderQueue - Set of instances that need rendering
   * @param renderer - The PixiJS WebGL renderer to use for all instances
   */
  private static renderAllQueued(
    renderQueue: Set<IRenderablePixiView>,
    renderer: WebGLRenderer,
  ): void {
    for (const instance of renderQueue) {
      if (instance.isDisposed) {
        continue;
      }
      PixiMultiViewManager.ensureRendererSize(renderer, instance.canvas);
      PixiMultiViewManager.renderToTargetCanvas(
        renderer,
        instance.canvas,
        instance.texture,
        instance.container,
      );
    }
  }

  /**
   * Disposes of this manager instance and releases all associated resources.
   *
   * This method performs complete cleanup of the manager including:
   * - Stopping the ticker-based rendering loop
   * - Destroying the WebGL renderer and its resources
   * - Clearing the render queue
   * - Marking the instance as disposed
   *
   * ## Important Notes
   *
   * - After disposal, the manager cannot be reused
   * - All rendering operations will be ignored after disposal
   * - The manager will log a warning if dispose is called multiple times
   * - Individual billboard instances are not disposed automatically
   *
   * @example
   * ```typescript
   * const manager = new PixiMultiViewManager();
   * await manager.init();
   *
   * // Use the manager...
   *
   * // Clean up when done
   * manager.dispose();
   *
   * // Manager is now unusable
   * console.log(manager.isDisposed); // true
   * ```
   */
  dispose(): void {
    if (this._isDisposed) {
      console.warn("PixiMultiViewManager already disposed.");
      return;
    }
    this._isDisposed = true;
    this._ticker.remove(this._renderLoop, this);
    if (this._renderer) {
      this._renderer.destroy();
    }
    this._renderQueue.clear();
  }
}
