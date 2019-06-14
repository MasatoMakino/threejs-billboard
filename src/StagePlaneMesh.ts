import {
  Mesh,
  PlaneBufferGeometry,
  MeshBasicMaterial,
  NormalBlending,
  Vector3,
  Scene,
  Camera,
  Geometry,
  Material,
  Object3D,
  WebGLRenderer
} from "three";
import { StageTexture } from "./StageTexture";
import { StageObject3D } from "./StageObject3D";

/**
 * Canvasに描画可能な板オブジェクト。
 * ビルボードと異なり、カメラには追従しない。
 *
 * ジオメトリはPlaneBufferGeometryなので、中心点からずらす場合はtranslateを使用する。
 * https://threejs.org/docs/#api/en/core/BufferGeometry.translate
 */
export class StagePlaneMesh extends Mesh {
  /**
   * 水平方向に回転し、カメラに追従するか否か。
   */
  public isLookingCameraHorizontal: boolean = false;
  private cameraPos: Vector3 = new Vector3();
  private worldPos: Vector3 = new Vector3();

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

    this.onBeforeRender = this.lookCamera;
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

  /**
   * Planeをカメラに向ける。lookCameraHorizontal = trueの時だけ稼働する。
   * 回転方向はY軸を中心とした左右方向のみ。
   * (X軸方向には回転しない。X軸方向に回転させたい場合はBillBoardクラスを利用する。)
   *
   * カメラ位置がPlaneの北極、南極をまたぐと急激に回転するので注意。
   * 利用する場合はカメラの高さ方向に制限をかけた方が良い。
   *
   * @param render
   * @param scene
   * @param camera
   * @param geometry
   * @param material
   * @param group
   */
  private lookCamera(
    render: WebGLRenderer,
    scene: Scene,
    camera: Camera,
    geometry: Geometry,
    material: Material,
    group: Object3D
  ) {
    if (!this.isLookingCameraHorizontal) return;

    camera.getWorldPosition(this.cameraPos);
    this.getWorldPosition(this.worldPos);
    this.cameraPos.setY(this.worldPos.y);

    this.lookAt(this.cameraPos);
  }
}
