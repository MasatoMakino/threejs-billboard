import { Vector2, Vector3, Plane, SphereBufferGeometry, Mesh, MeshBasicMaterial } from "three";
import { Math as ThreeMath } from "three";
/**
 * ビルボードのスケール値をカメラとレンダラーから算出するためのクラス。
 */
export class ScaleCalculator {
    /**
     * コンストラクタ
     * @param camera
     * @param renderer
     * @param scene
     */
    constructor(camera, renderer, scene) {
        this.worldDirection = new Vector3();
        this.worldPosition = new Vector3();
        this.targetWorldPosition = new Vector3();
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
    initRenderTarget(scene) {
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
     */
    updatePlane() {
        this.plane.setFromNormalAndCoplanarPoint(this._camera.getWorldDirection(this.worldDirection), this._camera.getWorldPosition(this.worldPosition));
    }
    /**
     * targetがドットバイドット表示になるスケール値を算出する。
     * @param target
     */
    getDotByDotScale(target) {
        const size = this._renderer.getSize(new Vector2());
        const distance = this.plane.distanceToPoint(target.getWorldPosition(this.targetWorldPosition));
        const getFovHeight = () => {
            const halfFov = ThreeMath.degToRad(this._camera.fov / 2);
            const half_fov_height = Math.tan(halfFov) * distance;
            return half_fov_height * 2;
        };
        return getFovHeight() / size.height;
    }
}
