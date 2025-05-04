import {
  autoDetectRenderer,
  type Container,
  Ticker,
  type WebGLRenderer,
} from "pixi.js";
import type { Texture } from "three";
import type { IRenderablePixiView } from "./RenderablePixiView";

/**
 * PixiMultiViewManagerOptions インターフェイスは、PixiMultiViewManager クラスのコンストラクターに渡されるオプションを定義します。
 */
interface PixiMultiViewManagerOptions {
  /**
   * レンダリングループに使用する PixiJS Ticker インスタンス。指定しない場合は Ticker.shared が使用されます。
   */
  ticker?: Ticker;
}

/**
 * PixiMultiViewManager クラスは、PixiJS v8 の multiView レンダラーの単一インスタンスを管理し、
 * 複数の IRenderablePixiView インスタンス（MultiViewPixiBillboard や MultiViewPixiPlaneMesh など）のレンダリング要求を調整します。
 *
 * SharedStage クラス群が単一の共有 Stage と Texture を使用するのに対し、
 * このマネージャーは複数の独立した Canvas と Texture を効率的に管理することに特化しています。
 *
 * 主に MultiViewPixiBillboard や MultiViewPixiPlaneMesh と組み合わせて使用され、
 * 各ビューの描画内容の更新を効率的に処理します。
 */
export class PixiMultiViewManager {
  /**
   * このインスタンスが破棄されたかどうかを示すフラグ。
   */
  private _isDisposed = false;
  /**
   * このインスタンスが破棄されたかどうかを取得します。
   */
  get isDisposed(): boolean {
    return this._isDisposed;
  }

  /**
   * 管理している PixiJS WebGLRenderer インスタンス。
   */
  get renderer(): WebGLRenderer | null {
    return this._renderer;
  }
  private _renderer: WebGLRenderer | null = null;
  /**
   * レンダリングループに使用される PixiJS Ticker インスタンス。
   */
  private _ticker: Ticker;
  /**
   * レンダリングが必要な IRenderablePixiView インスタンスのキュー。
   */
  private _renderQueue: Set<IRenderablePixiView> = new Set();

  /**
   * PixiMultiViewManager の新しいインスタンスを生成します。
   * @param options - コンストラクターオプション。
   */
  constructor(options?: PixiMultiViewManagerOptions) {
    this._ticker = options?.ticker ?? Ticker.shared;
  }

  /**
   * PixiJS レンダラーを非同期で初期化し、レンダリングループを開始します。
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
   * 指定された IRenderablePixiView インスタンスのレンダリングをリクエストします。
   * @param instance - レンダリングが必要なインスタンス。
   */
  requestRender(instance: IRenderablePixiView): void {
    if (instance.isDisposed) {
      return;
    }
    this._renderQueue.add(instance);
  }

  /**
   * レンダリングキュー内のインスタンスを処理するレンダリングループ。
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

  /**
   * Renders the specified container to the target canvas using the provided renderer and texture.
   *
   * note : targetCanvas is cleared before rendering with the clearRect method.
   * clearRect method clears with black transparent pixels, which is the default behavior of the 2D context.
   * 2D context does not support premultiplied alpha.
   * @see https://html.spec.whatwg.org/multipage/canvas.html#premultiplied-alpha-and-the-2d-rendering-context
   * If black lines are noticeable on the edges of the texture, change the alphaTest property from the default of 0.0 to a smaller value.
   * @see https://threejs.org/docs/#api/en/materials/Material.alphaTest
   *
   * @param renderer
   * @param targetCanvas
   * @param targetTexture
   * @param container
   * @returns
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
   * レンダリングキュー内のすべてのインスタンスをレンダリングします。
   * @param renderQueue - レンダリング対象のインスタンスのセット。
   * @param renderer - 使用する PixiJS レンダラー。
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
   * このマネージャーインスタンスが保持するリソースを解放します。
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
