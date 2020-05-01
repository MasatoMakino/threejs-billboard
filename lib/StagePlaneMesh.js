"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var three_1 = require("three");
var CameraChaser_1 = require("./CameraChaser");
var StageObject3D_1 = require("./StageObject3D");
var StageTexture_1 = require("./StageTexture");
/**
 * Canvasに描画可能な板オブジェクト。
 * ビルボードと異なり、カメラには追従しない。
 *
 * ジオメトリはPlaneBufferGeometryなので、中心点からずらす場合はtranslateを使用する。
 * https://threejs.org/docs/#api/en/core/BufferGeometry.translate
 */
var StagePlaneMesh = /** @class */ (function (_super) {
    __extends(StagePlaneMesh, _super);
    /**
     * コンストラクタ
     * @param width カンバスの幅
     * @param height カンバスの高さ
     * @param option テクスチャの初期化オプション
     */
    function StagePlaneMesh(width, height, option) {
        var _this = _super.call(this) || this;
        _this.initCanvas(width, height, option);
        _this.geometry = new three_1.PlaneBufferGeometry(width, height);
        _this.cameraChaser = new CameraChaser_1.CameraChaser(_this);
        return _this;
    }
    /**
     * 描画用カンバスを初期化し、自分自身のマテリアルに格納する。
     * @param width
     * @param height
     * @param option
     */
    StagePlaneMesh.prototype.initCanvas = function (width, height, option) {
        var texture = new StageTexture_1.StageTexture(width, height);
        this.material = new three_1.MeshBasicMaterial({
            map: texture,
            blending: three_1.NormalBlending,
            transparent: true,
            depthTest: true
        });
    };
    /**
     * オブジェクトの表示/非表示を設定する。
     * 設定に応じてテクスチャの更新を停止/再開する。
     * @param visible
     */
    StagePlaneMesh.prototype.setVisible = function (visible) {
        StageObject3D_1.StageObject3D.setVisible(this, visible);
    };
    StagePlaneMesh.prototype.getMap = function () {
        return this.material.map;
    };
    Object.defineProperty(StagePlaneMesh.prototype, "stage", {
        get: function () {
            return this.getMap().stage;
        },
        enumerable: true,
        configurable: true
    });
    StagePlaneMesh.prototype.setNeedUpdate = function () {
        this.getMap().setNeedUpdate();
    };
    return StagePlaneMesh;
}(three_1.Mesh));
exports.StagePlaneMesh = StagePlaneMesh;
