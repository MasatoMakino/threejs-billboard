import { Mesh } from "three";
/**
 * Canvasに描画可能な板オブジェクト。
 * ビルボードと異なり、カメラには追従しない。
 */
export declare class CanvasPlaneMesh extends Mesh {
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
}
//# sourceMappingURL=CanvasPlaneMesh.d.ts.map