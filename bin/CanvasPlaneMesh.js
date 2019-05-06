import { Mesh, PlaneGeometry, MeshBasicMaterial, NormalBlending } from "three";
import { CanvasTexture } from "./CanvasTexture";
import { CanvasObject3D } from "./CanvasObject3D";
/**
 * Canvasに描画可能な板オブジェクト。
 * ビルボードと異なり、カメラには追従しない。
 */
export class CanvasPlaneMesh extends Mesh {
    /**
     * コンストラクタ
     * @param width カンバスの幅
     * @param height カンバスの高さ
     * @param option テクスチャの初期化オプション
     */
    constructor(width, height, option) {
        super();
        this.initCanvas(width, height, option);
        this.geometry = new PlaneGeometry(width, height);
    }
    /**
     * 描画用カンバスを初期化し、自分自身のマテリアルに格納する。
     * @param width
     * @param height
     * @param option
     */
    initCanvas(width, height, option) {
        const texture = new CanvasTexture(width, height);
        this.material = new MeshBasicMaterial({
            map: texture,
            blending: NormalBlending,
            transparent: true,
            depthTest: true
        });
    }
    /**
     * オブジェクトの表示/非表示を設定する。
     * 設定に応じてテクスチャの更新を停止/再開する。
     * @param visible
     */
    setVisible(visible) {
        CanvasObject3D.setVisible(this, visible);
    }
}
