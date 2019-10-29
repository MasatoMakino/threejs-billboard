import {
  Vector3,
  Object3D,
  WebGLRenderer,
  Scene,
  Camera,
  Geometry,
  Material
} from "three";

export class CameraChaser {
  /**
   * 水平方向に回転し、カメラに追従するか否か。
   */
  public isLookingCameraHorizontal: boolean = false;
  private cameraPos: Vector3 = new Vector3();
  private worldPos: Vector3 = new Vector3();
  private target: Object3D;

  public needUpdateWorldPosition: boolean = false;

  constructor(target: Object3D) {
    this.target = target;
    this.target.getWorldPosition(this.worldPos);
    this.target.onBeforeRender = this.lookCamera;
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
  private lookCamera = (
    render: WebGLRenderer,
    scene: Scene,
    camera: Camera,
    geometry: Geometry,
    material: Material,
    group: Object3D
  ) => {
    if (!this.isLookingCameraHorizontal) return;
    if (this.needUpdateWorldPosition) {
      this.target.getWorldPosition(this.worldPos);
      this.needUpdateWorldPosition = false;
    }

    this.cameraPos.set(camera.position.x, this.worldPos.y, camera.position.z);
    this.target.lookAt(this.cameraPos);
  };
}
