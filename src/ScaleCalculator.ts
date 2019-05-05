import { Object3D, PerspectiveCamera } from "three";
import { Math as ThreeMath } from "three";
import { WebGLRenderer } from "three";
import { Vector2 } from "three";
import { Plane } from "three";
import { Vector3 } from "three";

export class ScaleCalculator {
  private _camera: PerspectiveCamera;
  private _renderer: WebGLRenderer;
  private plane: Plane;

  constructor(camera: PerspectiveCamera, renderer: WebGLRenderer) {
    this._camera = camera;
    this._renderer = renderer;
    this.plane = new Plane(new Vector3(0, 0, -1));
  }

  public updatePlane() {
    this.plane.setFromNormalAndCoplanarPoint(
      this._camera.getWorldDirection(new Vector3()),
      this._camera.getWorldPosition(new Vector3())
    );
  }

  public getDotByDotScale(target: Object3D): number {
    const size: Vector2 = this._renderer.getSize(new Vector2());
    const distance = this.plane.distanceToPoint(target.position);
    const getFovHeight = () => {
      const halfFov = ThreeMath.degToRad(this._camera.fov / 2);
      const half_fov_height = Math.tan(halfFov) * distance;
      return half_fov_height * 2;
    };

    return getFovHeight() / size.height;
  }
}
