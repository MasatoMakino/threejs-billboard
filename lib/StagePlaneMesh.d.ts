import { Mesh } from "three";
import { CameraChaser } from "./CameraChaser";
import { Container } from "pixi.js";
/**
 * Canvasに描画可能な板オブジェクト。
 * ビルボードと異なり、カメラには追従しない。
 *
 * ジオメトリはPlaneBufferGeometryなので、中心点からずらす場合はtranslateを使用する。
 * https://threejs.org/docs/#api/en/core/BufferGeometry.translate
 */
export declare class StagePlaneMesh extends Mesh {
    cameraChaser: CameraChaser;
    /**
     * コンストラクタ
     * @param width カンバスの幅
     * @param height カンバスの高さ
     * @param option テクスチャの初期化オプション
     */
    constructor(width: number, height: number, option?: {});
    /**
     * 描画用カンバスを初期化し、自分自身のマテリアルに格納する。
     * @param width
     * @param height
     * @param option
     */
    private initCanvas;
    /**
     * オブジェクトの表示/非表示を設定する。
     * 設定に応じてテクスチャの更新を停止/再開する。
     * @param visible
     */
    setVisible(visible: boolean): void;
    private getMap;
    get stage(): Container;
    setNeedUpdate(): void;
}
//# sourceMappingURL=StagePlaneMesh.d.ts.map