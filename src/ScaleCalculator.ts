import {
  Object3D,
  PerspectiveCamera,
  WebGLRenderer,
  Vector2,
  Vector3,
  Plane,
  Scene,
  SphereBufferGeometry,
  Mesh,
  MeshBasicMaterial
} from "three";
import { Math as ThreeMath } from "three";

/**
 * ビルボードのスケール値をカメラとレンダラーから算出するためのクラス。
 */
export class ScaleCalculator {
  private _camera: PerspectiveCamera;
  private _renderer: WebGLRenderer;
  private plane: Plane; //カメラ側のプレーン

  private worldDirection = new Vector3();
  private worldPosition = new Vector3();
  private targetWorldPosition = new Vector3();

  /**
   * コンストラクタ
   * @param camera
   * @param renderer
   * @param scene
   */
  constructor(
    camera: PerspectiveCamera,
    renderer: WebGLRenderer,
    scene: Scene
  ) {
    this._camera = camera;
    this._renderer = renderer;
    this.plane = new Plane(new Vector3(0, 0, -1));

    this.initRenderTarget(scene);
  }

  /**
   * 表示されないオブジェクトをシーンに挿入する。
   * このオブジェクトの描画を監視して、カメラ側のプレーンを更新する。
   * @param scene
   */
  private initRenderTarget(scene: Scene) {
    const geo = new SphereBufferGeometry(1e-4, 3, 2);
    const mat = new MeshBasicMaterial({
      transparent: true,
      opacity: 0.0,
      depthTest: false
    });
    const renderTarget = new Mesh(geo, mat);
    renderTarget.renderOrder = Number.MIN_SAFE_INTEGER;
    scene.add(renderTarget);
    renderTarget.onBeforeRender = () => {
      this.updatePlane();
    };
  }

  /**
   * カメラ側のプレーンの位置を更新する。
   * このプレーンはカメラの位置と向きに一致する。
   */
  public updatePlane() {
    this.plane.setFromNormalAndCoplanarPoint(
      this._camera.getWorldDirection(this.worldDirection),
      this._camera.getWorldPosition(this.worldPosition)
    );
  }

  /**
   * targetがドットバイドット表示になるスケール値を算出する。
   * プレーンから対象オブジェクトまでの距離を利用し、スケール値を逆算する。
   *
   * SpriteMaterial.sizeAttenuation = true[Default]
   * の設定されたオブジェクト用。
   * https://threejs.org/docs/#api/en/materials/SpriteMaterial.sizeAttenuation
   *
   * @param target
   */
  public getDotByDotScale(target: Object3D): number {
    const size: Vector2 = this._renderer.getSize(new Vector2());
    const distance = this.plane.distanceToPoint(
      target.getWorldPosition(this.targetWorldPosition)
    );
    return this.getFovHeight(distance) / size.height;
  }

  /**
   * SpriteMaterial.sizeAttenuation = false
   * の設定されたSprite用のスケール値を取得する。
   */
  public getNonAttenuateScale(): number {
    const size: Vector2 = this._renderer.getSize(new Vector2());
    return this.getFovHeight(1.0) / size.height;
  }

  private getFovHeight(distance: number): number {
    const halfFov = ThreeMath.degToRad(this._camera.fov / 2);
    const half_fov_height = Math.tan(halfFov) * distance;
    return half_fov_height * 2;
  }
}
