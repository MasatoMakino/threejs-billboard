import { Container } from "pixi.js";
import {
  Mesh,
  MeshBasicMaterial,
  NormalBlending,
  PlaneBufferGeometry,
} from "three";
import { CameraChaser } from "./CameraChaser";
import { StageObject3D } from "./StageObject3D";
import { StageTexture } from "./StageTexture";

/**
 * Canvasに描画可能な板オブジェクト。
 * ビルボードと異なり、カメラには追従しない。
 *
 * ジオメトリはPlaneBufferGeometryなので、中心点からずらす場合はtranslateを使用する。
 * https://threejs.org/docs/#api/en/core/BufferGeometry.translate
 */
export class StagePlaneMesh extends Mesh {
  public cameraChaser: CameraChaser;

  /**
   * コンストラクタ
   * @param width カンバスの幅
   * @param height カンバスの高さ
   * @param option テクスチャの初期化オプション
   */
  constructor(width: number, height: number, option?: {}) {
    super();
    this.initCanvas(width, height, option);
    this.geometry = new PlaneBufferGeometry(width, height);
    this.cameraChaser = new CameraChaser(this);
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
      depthTest: true,
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

  private getMap(): StageTexture {
    return (this.material as MeshBasicMaterial).map as StageTexture;
  }
  get stage(): Container {
    return this.getMap().stage;
  }

  public setNeedUpdate(): void {
    this.getMap().setNeedUpdate();
  }
}
