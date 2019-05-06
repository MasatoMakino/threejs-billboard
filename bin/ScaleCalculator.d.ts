import { Object3D, PerspectiveCamera, WebGLRenderer, Scene } from "three";
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
     */
    private updatePlane;
    /**
     * targetがドットバイドット表示になるスケール値を算出する。
     * @param target
     */
    getDotByDotScale(target: Object3D): number;
}
//# sourceMappingURL=ScaleCalculator.d.ts.map