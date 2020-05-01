"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var three_1 = require("three");
/**
 * ビルボード処理に必要な機能を備えたクラス。
 * MeshやSprite内でこのクラスを呼び出すことで、ビルボードとして機能する。
 */
var BillBoardController = /** @class */ (function () {
    /**
     * コンストラクタ
     * @param target
     * @param url テクスチャー画像ファイルのURL
     * @param imageScale
     * @param option
     */
    function BillBoardController(target, url, imageScale, option) {
        var _this = this;
        this.isInitGeometry = false;
        /**
         * テクスチャ画像のアスペクト比を維持したままスケールを調整する。
         */
        this.updateScale = function () {
            var map = _this._target.material.map;
            if (map == null || map.image == null)
                return;
            var img = map.image;
            _this.initGeometry(img);
            var scale = _this.calculateScale(img);
            _this._target.scale.set(scale.x, scale.y, 1);
        };
        this._target = target;
        this._imageScale = imageScale;
        this.initDummyPlane(target);
        var mat = this.getMaterial(target);
        mat.visible = false;
        this._target.material = mat;
        new three_1.TextureLoader().load(url, function (texture) {
            texture.minFilter = option.minFilter;
            mat.map = texture;
            mat.needsUpdate = true;
            mat.visible = true;
            _this.updateScale();
        });
    }
    BillBoardController.prototype.getMaterial = function (target) {
        if (target instanceof three_1.Mesh) {
            return new three_1.MeshBasicMaterial({
                blending: three_1.NormalBlending,
                depthTest: true,
                transparent: true
            });
        }
        if (target instanceof three_1.Sprite) {
            return new three_1.SpriteMaterial({
                blending: three_1.NormalBlending,
                depthTest: true,
                transparent: true
            });
        }
    };
    BillBoardController.prototype.initDummyPlane = function (target) {
        if (target instanceof three_1.Mesh) {
            var size = 0.0000001;
            target.geometry = new three_1.PlaneBufferGeometry(size, size);
        }
    };
    BillBoardController.prototype.initGeometry = function (image) {
        if (!(this._target instanceof three_1.Mesh))
            return;
        if (this.isInitGeometry)
            return;
        this._target.geometry = new three_1.PlaneBufferGeometry(image.width, image.height);
        this.isInitGeometry = true;
    };
    BillBoardController.prototype.calculateScale = function (img) {
        if (this._target instanceof three_1.Sprite) {
            return {
                x: img.width * this._imageScale,
                y: img.height * this._imageScale
            };
        }
        if (this._target instanceof three_1.Mesh) {
            return {
                x: this._imageScale,
                y: this._imageScale
            };
        }
    };
    Object.defineProperty(BillBoardController.prototype, "imageScale", {
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
    return BillBoardController;
}());
exports.BillBoardController = BillBoardController;
