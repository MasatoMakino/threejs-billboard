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
var StageObject3D_1 = require("./StageObject3D");
var StageTexture_1 = require("./StageTexture");
var StageBillBoard = /** @class */ (function (_super) {
    __extends(StageBillBoard, _super);
    function StageBillBoard(width, height, imageScale, option) {
        if (imageScale === void 0) { imageScale = 1; }
        var _this = _super.call(this) || this;
        _this._imageScale = imageScale;
        _this.initTexture(width, height, option);
        return _this;
    }
    StageBillBoard.prototype.initTexture = function (width, height, option) {
        var texture = new StageTexture_1.StageTexture(width, height);
        texture.minFilter = three_1.LinearFilter;
        this.material = new three_1.SpriteMaterial({
            map: texture,
            blending: three_1.NormalBlending,
            depthTest: false,
            transparent: true
        });
        this.updateScale();
    };
    Object.defineProperty(StageBillBoard.prototype, "imageScale", {
        get: function () {
            return this._imageScale;
        },
        /**
         * 画像のスケールを指定する。
         *
         * ScaleCalculator.getDotByDotScale関数で得られた値を設定すると、ビルボードはテクスチャ画像のサイズのまま表示される。
         *
         * @param value
         */
        set: function (value) {
            this._imageScale = value;
            this.updateScale();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * テクスチャ画像のアスペクト比を維持したままスケールを調整する。
     */
    StageBillBoard.prototype.updateScale = function () {
        var map = this.material.map;
        var canvas = map.domElement;
        this.scale.set(canvas.width * this._imageScale, canvas.height * this._imageScale, 1);
    };
    /**
     * オブジェクトの表示/非表示を設定する。
     * 設定に応じてテクスチャの更新を停止/再開する。
     * @param visible
     */
    StageBillBoard.prototype.setVisible = function (visible) {
        StageObject3D_1.StageObject3D.setVisible(this, visible);
    };
    StageBillBoard.prototype.getMap = function () {
        return this.material.map;
    };
    Object.defineProperty(StageBillBoard.prototype, "stage", {
        get: function () {
            return this.getMap().stage;
        },
        enumerable: true,
        configurable: true
    });
    StageBillBoard.prototype.setNeedUpdate = function () {
        this.getMap().setNeedUpdate();
    };
    return StageBillBoard;
}(three_1.Sprite));
exports.StageBillBoard = StageBillBoard;
