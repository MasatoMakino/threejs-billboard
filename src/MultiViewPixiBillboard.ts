import { Container } from "pixi.js";
import { CanvasTexture, Sprite, Texture, SpriteMaterial } from "three";
import { PixiMultiViewManager } from "./PixiMultiViewManager.js";
import { IRenderablePixiView } from "./RenderablePixiView";
import { MultiViewObject3DUtils } from "./MultiViewObject3DUtils.js";
import { MultiViewPixiObjectOptions } from "./MultiViewPixiObjectOptions.js";

/**
 * MultiViewPixiBillboardOptions インターフェイスは、MultiViewPixiBillboard クラスのコンストラクターに渡されるオプションを定義します。
 */
interface MultiViewPixiBillboardOptions extends MultiViewPixiObjectOptions {
  // MultiViewPixiBillboard 固有のオプションがあればここに追加
}

/**
 * MultiViewPixiBillboard クラスは、PixiJS v8 の multiView 機能を使用して、独立した Canvas に描画されるビルボード機能を提供します。
 * Three.js の Sprite を継承し、独自の HTMLCanvasElement と PixiJS Container を持ちます。
 * レンダリング管理には PixiMultiViewManager を利用します。
 *
 * SharedStageBillboard クラスと比較して、MultiViewPixiBillboard は各インスタンスが独立した Canvas を持つため、
 * 部分的な内容更新が多い場合にパフォーマンス上の利点があります。
 * また、必要なビルボード数が事前に不明な場合でも柔軟に対応できます。
 * 一方、SharedStageBillboard は単一の共有 Canvas と Texture を使用するため、テクスチャとマテリアルインスタンスを共有可能で、
 * ドローコール数の削減が期待できますが、共有 Canvas のサイズに限界があり、多数のビルボードを配置するとテクスチャのマッピングに失敗する可能性があります。
 *
 * MultiViewPixiBillboard は、多数のビルボードがあり、それぞれが頻繁に、かつ独立して内容を更新する場合、
 * または必要なビルボード数が動的に変動する場合に適しています。
 */
export class MultiViewPixiBillboard
  extends Sprite
  implements IRenderablePixiView
{
  /**
   * このインスタンスが破棄されたかどうかを示すフラグ。
   */
  private _isDisposed: boolean = false;
  /**
   * このインスタンスが破棄されたかどうかを取得します。
   */
  get isDisposed(): boolean {
    return this._isDisposed;
  }

  /**
   * このビルボードに関連付けられた HTMLCanvasElement。
   */
  private _canvas: HTMLCanvasElement;
  /**
   * このビルボードに関連付けられた HTMLCanvasElement を取得します。
   */
  get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  /**
   * このビルボードに関連付けられた PixiJS Container。
   */
  private _container: Container;
  /**
   * このビルボードに関連付けられた PixiJS Container を取得します。
   * 外部から参照可能ですが、上書きはできません。
   */
  get container(): Container {
    return this._container;
  }

  /**
   * このビルボードに関連付けられた Three.js の CanvasTexture。
   */
  private _texture: CanvasTexture;
  /**
   * このビルボードに関連付けられた Three.js の Texture を取得します。
   */
  get texture(): Texture {
    return this._texture;
  }
  /**
   * このビルボードを管理する PixiMultiViewManager インスタンス。
   */
  private _manager: PixiMultiViewManager;

  /**
   * MultiViewPixiBillboard の新しいインスタンスを生成します。
   * @param options - コンストラクターオプション。
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
   * ビルボードのスケールを設定します。
   *
   * @param scale - 適用するスケールファクター。
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
   * ビルボードの内容が更新されたことをマネージャーに通知し、再レンダリングをリクエストします。
   */
  updateContent(): void {
    if (this._isDisposed) {
      console.warn("Attempted to update disposed MultiViewPixiBillboard.");
      return;
    }
    this._manager.requestRender(this);
  }

  /**
   * このビルボードインスタンスが保持するリソースを解放します。
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
