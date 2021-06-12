"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StagePlaneMesh = void 0;
const three_1 = require("three");
const CameraChaser_1 = require("./CameraChaser");
const StageObject3D_1 = require("./StageObject3D");
const StageTexture_1 = require("./StageTexture");
/**
 * Canvasに描画可能な板オブジェクト。
 * ビルボードと異なり、カメラには追従しない。
 *
 * ジオメトリはPlaneBufferGeometryなので、中心点からずらす場合はtranslateを使用する。
 * https://threejs.org/docs/#api/en/core/BufferGeometry.translate
 */
class StagePlaneMesh extends three_1.Mesh {
    /**
     * コンストラクタ
     * @param width カンバスの幅
     * @param height カンバスの高さ
     * @param option テクスチャの初期化オプション
     */
    constructor(width, height, option) {
        super();
        this.initCanvas(width, height, option);
        this.geometry = new three_1.PlaneBufferGeometry(width, height);
        this.cameraChaser = new CameraChaser_1.CameraChaser(this);
    }
    /**
     * 描画用カンバスを初期化し、自分自身のマテリアルに格納する。
     * @param width
     * @param height
     * @param option
     */
    initCanvas(width, height, option) {
        const texture = new StageTexture_1.StageTexture(width, height);
        this.material = new three_1.MeshBasicMaterial({
            map: texture,
            blending: three_1.NormalBlending,
            transparent: true,
            depthTest: true,
        });
    }
    /**
     * オブジェクトの表示/非表示を設定する。
     * 設定に応じてテクスチャの更新を停止/再開する。
     * @param visible
     */
    setVisible(visible) {
        StageObject3D_1.StageObject3D.setVisible(this, visible);
    }
    getMap() {
        return this.material.map;
    }
    get stage() {
        return this.getMap().stage;
    }
    setNeedUpdate() {
        this.getMap().setNeedUpdate();
    }
}
exports.StagePlaneMesh = StagePlaneMesh;
