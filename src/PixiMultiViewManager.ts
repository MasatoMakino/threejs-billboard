import { autoDetectRenderer, Container, Ticker, WebGLRenderer } from "pixi.js"; // Import necessary components from pixi.js
import { IRenderablePixiView } from "./RenderablePixiView"; // Import the interface

export class PixiMultiViewManager {
  get renderer(): WebGLRenderer | null {
    return this._renderer;
  } // Getter for renderer
  private _renderer: WebGLRenderer | null = null; // Renderer is now initialized asynchronously
  private _ticker: Ticker;
  private _renderQueue: Set<IRenderablePixiView> = new Set(); // Use the interface
  private _stage: Container; // Add a persistent root stage

  constructor(ticker: Ticker = Ticker.shared) {
    this._ticker = ticker;
    this._stage = new Container(); // Initialize the root stage
    // Renderer is initialized in the init method
  }

  async init(): Promise<void> {
    if (this._renderer) {
      console.warn("PixiMultiViewManager already initialized.");
      return;
    }

    this._renderer = (await autoDetectRenderer({
      // view: document.createElement('canvas'), // Offscreen canvas - Removed as per feedback
      // width: 1, // Initial size, will be adjusted by content
      // height: 1,
      // autoDensity: true,
      // powerPreference: 'high-performance',
      // backgroundColor: 0x333333, // Transparent background
      // backgroundAlpha: 0.5,
      backgroundAlpha: 0,
      multiView: true,
    })) as WebGLRenderer; // Cast to Renderer type

    this._ticker.add(this._renderLoop, this);
    this._ticker.start();
  }

  requestRender(instance: IRenderablePixiView): void {
    // Use IRenderablePixiView
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
        // Remove disposed instances from the queue
        this._renderQueue.delete(instance);
        continue;
      }
      // Ensure the container is not already a child of the stage
      if (instance.container.parent !== this._stage) {
        this._stage.addChild(instance.container);
      }
    }

    if (this._stage.children.length === 0) {
      this._renderQueue.clear();
      return;
    }

    // Ensure canvas sizes are correct before rendering using renderer.context.ensureCanvasSize
    for (const instance of this._renderQueue) {
      if (instance.isDisposed) {
        continue;
      }
      const targetCanvas = (instance as any)._canvas; // Access the internal canvas
      // Use type assertion to access context
      if (targetCanvas && this._renderer.context.multiView) {
        console.log(
          "Ensuring canvas size:",
          targetCanvas.width,
          targetCanvas.height,
        );
        // this._renderer.context.ensureCanvasSize(targetCanvas);

        const canvas = this._renderer;
        console.log(canvas.width, canvas.height);

        const w = Math.max(canvas.width, targetCanvas.width);
        const h = Math.max(canvas.height, targetCanvas.height);
        if (canvas.width !== w || canvas.height !== h) {
          canvas.resize(w, h);
          console.log("Canvas size ensured:", canvas.width, canvas.height);
          console.log(this._renderer.canvas);
        }
      }
    }

    // Adjust container position for left-bottom origin before rendering to the offscreen canvas
    for (const instance of this._renderQueue) {
      if (instance.isDisposed) {
        continue;
      }
      const canvas = this._renderer.canvas;
      const targetCanvas = (instance as any)._canvas; // Access the internal canvas
      if (canvas && targetCanvas) {
        instance.container.position.y = canvas.height - targetCanvas.height;
        console.log(
          "Container position adjusted:",
          canvas.height,
          targetCanvas.height,
          instance.container.position.y,
        );
      }
    }

    // Render the entire stage to the offscreen canvas
    this._renderer.render(this._stage);

    // Copy rendered content to individual canvases and update textures
    for (const instance of this._renderQueue) {
      if (instance.isDisposed) {
        continue; // Already handled above, but double check
      }

      const canvas = (instance as any)._canvas; // Access the internal canvas
      const texture = (instance as any)._texture; // Access the internal texture

      if (canvas && texture) {
        const clear = (canvas: HTMLCanvasElement) => {
          const context = canvas.getContext("2d");
          if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
          }
        };
        clear(this._renderer.canvas); // Clear the offscreen canvas
        clear(canvas); // Clear the instance's canvas

        this._renderer.render(this._stage);
        this._renderer.render({
          container: instance.container,
          target: canvas,
        });
        texture.needsUpdate = true;
      }
    }

    // Remove processed containers from the stage
    for (const instance of this._renderQueue) {
      if (!instance.isDisposed && instance.container.parent === this._stage) {
        this._stage.removeChild(instance.container);
      }
    }

    // Clear the queue after rendering
    this._renderQueue.clear();
  }

  dispose(): void {
    this._ticker.remove(this._renderLoop, this);
    this._ticker.stop();
    if (this._renderer) {
      this._renderer.destroy();
    }
    this._stage.destroy({ children: true }); // Destroy the stage and its children
    this._renderQueue.clear();
  }
}
