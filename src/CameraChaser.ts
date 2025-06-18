import {
  type BufferGeometry,
  type Camera,
  type Material,
  type Object3D,
  type Scene,
  Vector3,
  type WebGLRenderer,
} from "three";

export class CameraChaser {
  /**
   * 水平方向に回転し、カメラに追従するか否か。
   */
  public isLookingCameraHorizontal = false;
  private cameraPos: Vector3 = new Vector3();
  private worldPos: Vector3 = new Vector3();
  private target: Object3D | undefined;
  private originalOnBeforeRender;

  public needUpdateWorldPosition = false;

  constructor(target: Object3D) {
    this.target = target;
    this.target.getWorldPosition(this.worldPos);
    this.originalOnBeforeRender = this.target.onBeforeRender;
    this.target.onBeforeRender = this.lookCamera;
  }

  /**
   * リソースを解放する。
   */
  dispose(): void {
    if (this.target) {
      this.target.onBeforeRender = this.originalOnBeforeRender;
      this.target = undefined;
    }
  }

  /**
   * Planeをカメラに向ける。lookCameraHorizontal = trueの時だけ稼働する。
   * 回転方向はY軸を中心とした左右方向のみ。
   * (X軸方向には回転しない。X軸方向に回転させたい場合はBillBoardクラスを利用する。)
   *
   * カメラ位置がPlaneの北極、南極をまたぐと急激に回転するので注意。
   * 利用する場合はカメラの高さ方向に制限をかけた方が良い。
   *
   * @param _render
   * @param _scene
   * @param camera
   * @param _geometry
   * @param _material
   * @param _group
   */
  private lookCamera = (
    _render: WebGLRenderer,
    _scene: Scene,
    camera: Camera,
    _geometry: BufferGeometry,
    _material: Material,
    _group: Object3D,
  ) => {
    if (!this.isLookingCameraHorizontal || !this.target) return; // Add check for target
    if (this.needUpdateWorldPosition) {
      this.target.getWorldPosition(this.worldPos);
      this.needUpdateWorldPosition = false;
    }

    this.cameraPos.set(camera.position.x, this.worldPos.y, camera.position.z);
    this.target.lookAt(this.cameraPos);
  };
}
