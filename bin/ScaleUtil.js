import { Math as ThreeMath } from "three";
import { Vector2 } from "three";
import { Plane } from "three";
import { Vector3 } from "three";
export class ScaleCalculator {
    constructor(camera, renderer) {
        this._camera = camera;
        this._renderer = renderer;
        this.plane = new Plane(new Vector3(0, 0, -1));
    }
    updatePlane() {
        this.plane.setFromNormalAndCoplanarPoint(this._camera.getWorldDirection(new Vector3()), this._camera.getWorldPosition(new Vector3()));
    }
    getDotByDotScale(target) {
        const size = this._renderer.getSize(new Vector2());
        const distance = this.plane.distanceToPoint(target.position);
        const getFovHeight = () => {
            const halfFov = ThreeMath.degToRad(this._camera.fov / 2);
            const half_fov_height = Math.tan(halfFov) * distance;
            return half_fov_height * 2;
        };
        return getFovHeight() / size.height;
    }
}
