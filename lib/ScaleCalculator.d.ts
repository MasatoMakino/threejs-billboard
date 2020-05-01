import {Object3D, PerspectiveCamera, Scene, WebGLRenderer} from "three";

/**
 * ビルボードのスケール値をカメラとレンダラーから算出するためのクラス。
 */
export declare class ScaleCalculator {
    private _camera;
    private _renderer;
    private plane;
    private worldDirection;
    private worldPosition;
    private targetWorldPosition;
    /**
     * コンストラクタ
     * @param camera
     * @param renderer
     * @param scene
     */
    constructor(camera: PerspectiveCamera, renderer: WebGLRenderer, scene: Scene);
    /**
     * 表示されないオブジェクトをシーンに挿入する。
     * このオブジェクトの描画を監視して、カメラ側のプレーンを更新する。
     * @param scene
     */
    private initRenderTarget;
    /**
     * カメラ側のプレーンの位置を更新する。
     * このプレーンはカメラの位置と向きに一致する。
     */
    updatePlane(): void;
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
    getDotByDotScale(target: Object3D): number;
    /**
     * SpriteMaterial.sizeAttenuation = false
     * の設定されたSprite用のスケール値を取得する。
     */
    getNonAttenuateScale(): number;
    private getFovHeight;
}
//# sourceMappingURL=ScaleCalculator.d.ts.map