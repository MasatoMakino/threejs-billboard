import { autoDetectRenderer, Container, Ticker, WebGLRenderer } from "pixi.js";
import { IRenderablePixiView } from "./RenderablePixiView";
import { CanvasTexture, Texture } from "three";

export class PixiMultiViewManager {
  get renderer(): WebGLRenderer | null {
    return this._renderer;
  }
  private _renderer: WebGLRenderer | null = null; // Renderer is now initialized asynchronously
  private _ticker: Ticker;
  private _renderQueue: Set<IRenderablePixiView> = new Set(); // Use the interface
  private _stage: Container; // Add a persistent root stage

  constructor(ticker: Ticker = Ticker.shared) {
    this._ticker = ticker;
    this._stage = new Container();
  }

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
      backgroundAlpha: 0,
      multiView: true,
    })) as WebGLRenderer;

    this._ticker.add(this._renderLoop, this);
    this._ticker.start();
  }

  requestRender(instance: IRenderablePixiView): void {
    if (instance.isDisposed) {
      return;
    }
    this._renderQueue.add(instance);
  }

  private _renderLoop(): void {
    if (this._renderQueue.size === 0 || !this._renderer) {
      return;
    }

    // Add only the containers that need rendering to the persistent stage
    for (const instance of this._renderQueue) {
      if (instance.isDisposed) {
        this._renderQueue.delete(instance);
        continue;
      }
    }

    // Ensure canvas sizes are correct before rendering using renderer.context.ensureCanvasSize
    for (const instance of this._renderQueue) {
      if (instance.isDisposed) {
        continue;
      }
      this._stage.addChild(instance.container);
      PixiMultiViewManager.ensureRendererSize(this._renderer, instance.canvas);
      PixiMultiViewManager.renderToTargetCanvas(
        this._renderer,
        instance.canvas,
        instance.texture,
        instance.container,
      );
      instance.container.removeFromParent();
    }

    this._renderQueue.clear();
    this._stage.removeChildren();
  }

  /**
   * Ensures the renderer size matches the target canvas size.
   * @param renderer
   * @param targetCanvas
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

  private static renderToTargetCanvas(
    renderer: WebGLRenderer,
    targetCanvas: HTMLCanvasElement,
    targetTexture: Texture,
    container: Container,
  ): void {
    if (!renderer || !targetCanvas || !targetTexture) {
      return;
    }

    const clear = (canvas: HTMLCanvasElement) => {
      const context = canvas.getContext("2d");
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    clear(targetCanvas); // Clear the instance's canvas

    renderer.render({
      container: container,
      target: targetCanvas,
    });
    targetTexture.needsUpdate = true; // Access needsUpdate on Three.js Texture
  }

  dispose(): void {
    this._ticker.remove(this._renderLoop, this);
    if (this._renderer) {
      this._renderer.destroy();
    }
    this._stage.destroy({ children: true }); // Destroy the stage and its children
    this._renderQueue.clear();
  }
}
