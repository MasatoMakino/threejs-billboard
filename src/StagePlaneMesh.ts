import { Mesh, PlaneGeometry, MeshBasicMaterial, NormalBlending } from "three";
import { StageTexture } from "./StageTexture";
import { StageObject3D } from "./StageObject3D";

/**
 * Canvasに描画可能な板オブジェクト。
 * ビルボードと異なり、カメラには追従しない。
 *
 * ジオメトリはPlaneGeometryなので、中心点からずらす場合はGeometry.translateを使用する。
 * https://threejs.org/docs/#api/en/core/Geometry.translate
 */
export class StagePlaneMesh extends Mesh {
  /**
   * コンストラクタ
   * @param width カンバスの幅
   * @param height カンバスの高さ
   * @param option テクスチャの初期化オプション
   */
  constructor(width: number, height: number, option?: {}) {
    super();
    this.initCanvas(width, height, option);
    this.geometry = new PlaneGeometry(width, height);
  }

  /**
   * 描画用カンバスを初期化し、自分自身のマテリアルに格納する。
   * @param width
   * @param height
   * @param option
   */
  private initCanvas(width: number, height: number, option?: {}): void {
    const texture: StageTexture = new StageTexture(width, height);

    this.material = new MeshBasicMaterial({
      map: texture,
      blending: NormalBlending,
      transparent: true,
      depthTest: true
    });
  }

  /**
   * オブジェクトの表示/非表示を設定する。
   * 設定に応じてテクスチャの更新を停止/再開する。
   * @param visible
   */
  public setVisible(visible: boolean): void {
    StageObject3D.setVisible(this, visible);
  }
}
