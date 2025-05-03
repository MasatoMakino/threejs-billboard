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
 * MultiViewPixiPlaneMeshOptions インターフェイスは、MultiViewPixiPlaneMesh クラスのコンストラクターに渡されるオプションを定義します。
 */
interface MultiViewPixiPlaneMeshOptions extends MultiViewPixiObjectOptions {
  // MultiViewPixiPlaneMesh 固有のオプションがあればここに追加
}

/**
 * MultiViewPixiPlaneMesh クラスは、PixiJS v8 の multiView 機能を使用して、独立した Canvas に描画されるプレーンメッシュ機能を提供します。
 * Three.js の Mesh を継承し、独自の HTMLCanvasElement と PixiJS Container を持ちます。
 * レンダリング管理には PixiMultiViewManager を利用し、CameraChaser によるカメラ追従機能も提供します。
 *
 * SharedStagePlaneMesh クラスと比較して、MultiViewPixiPlaneMesh は各インスタンスが独立した Canvas を持つため、
 * 部分的な内容更新が多い場合にパフォーマンス上の利点があります。
 * また、必要なプレーンメッシュ数が事前に不明な場合でも柔軟に対応できます。
 * 一方、SharedStagePlaneMesh は単一の共有 Canvas と Texture を使用するため、テクスチャとマテリアルインスタンスを共有可能で、
 * ドローコール数の削減が期待できますが、共有 Canvas のサイズに限界があり、多数のプレーンメッシュを配置するとテクスチャのマッピングに失敗する可能性があります。
 *
 * MultiViewPixiPlaneMesh は、多数のプレーンメッシュがあり、それぞれが頻繁に、かつ独立して内容を更新する場合、
 * または必要なプレーンメッシュ数が動的に変動する場合に適しています。
 */
export class MultiViewPixiPlaneMesh
  extends Mesh
  implements IRenderablePixiView
{
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
   * このプレーンメッシュに関連付けられた HTMLCanvasElement。
   */
  private _canvas: HTMLCanvasElement;
  /**
   * このプレーンメッシュに関連付けられた HTMLCanvasElement を取得します。
   */
  get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  /**
   * このプレーンメッシュに関連付けられた PixiJS Container。
   */
  private _container: Container;
  /**
   * このプレーンメッシュに関連付けられた PixiJS Container を取得します。
   * 外部から参照可能ですが、上書きはできません。
   */
  get container(): Container {
    return this._container;
  }

  /**
   * このプレーンメッシュに関連付けられた Three.js の CanvasTexture。
   */
  private _texture: CanvasTexture;
  /**
   * このプレーンメッシュに関連付けられた Three.js の Texture を取得します。
   */
  get texture(): Texture {
    return this._texture;
  }

  /**
   * このプレーンメッシュを管理する PixiMultiViewManager インスタンス。
   */
  private _manager: PixiMultiViewManager;
  /**
   * このプレーンメッシュのカメラ追従を管理する CameraChaser インスタンス。
   */
  private _cameraChaser: CameraChaser | undefined;
  /**
   * このプレーンメッシュの CameraChaser インスタンスを取得します。
   */
  get cameraChaser(): CameraChaser | undefined {
    return this._cameraChaser;
  }

  /**
   * MultiViewPixiPlaneMesh の新しいインスタンスを生成します。
   * @param options - コンストラクターオプション。
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
   * メッシュのスケールを設定します。
   *
   * @param scale - 適用するスケールファクター。
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
   * プレーンメッシュの内容が更新されたことをマネージャーに通知し、再レンダリングをリクエストします。
   */
  updateContent(): void {
    if (this._isDisposed) {
      console.warn("Attempted to update disposed MultiViewPixiPlaneMesh.");
      return;
    }
    this._manager.requestRender(this);
  }

  /**
   * このプレーンメッシュインスタンスが保持するリソースを解放します。
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
