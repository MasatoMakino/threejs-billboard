"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillBoardController = void 0;
const three_1 = require("three");
/**
 * ビルボード処理に必要な機能を備えたクラス。
 * MeshやSprite内でこのクラスを呼び出すことで、ビルボードとして機能する。
 */
class BillBoardController {
    /**
     * コンストラクタ
     * @param target
     * @param url テクスチャー画像ファイルのURL
     * @param imageScale
     * @param option
     */
    constructor(target, url, imageScale, option) {
        this.isInitGeometry = false;
        /**
         * テクスチャ画像のアスペクト比を維持したままスケールを調整する。
         */
        this.updateScale = () => {
            const map = this._target.material.map;
            if (map == null || map.image == null)
                return;
            const img = map.image;
            this.initGeometry(img);
            const scale = this.calculateScale(img);
            this._target.scale.set(scale.x, scale.y, 1);
        };
        this._target = target;
        this._imageScale = imageScale;
        this.initDummyPlane(target);
        const mat = this.getMaterial(target);
        mat.visible = false;
        this._target.material = mat;
        new three_1.TextureLoader().load(url, texture => {
            texture.minFilter = option.minFilter;
            mat.map = texture;
            mat.needsUpdate = true;
            mat.visible = true;
            this.updateScale();
        });
    }
    getMaterial(target) {
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
    }
    initDummyPlane(target) {
        if (target instanceof three_1.Mesh) {
            const size = 0.0000001;
            target.geometry = new three_1.PlaneBufferGeometry(size, size);
        }
    }
    initGeometry(image) {
        if (!(this._target instanceof three_1.Mesh))
            return;
        if (this.isInitGeometry)
            return;
        this._target.geometry = new three_1.PlaneBufferGeometry(image.width, image.height);
        this.isInitGeometry = true;
    }
    calculateScale(img) {
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
    }
    get imageScale() {
        return this._imageScale;
    }
    /**
     * 画像のスケールを指定する。
     *
     * ScaleCalculator.getDotByDotScale関数で得られた値を設定すると、ビルボードはテクスチャ画像のサイズのまま表示される。
     *
     * @param value
     */
    set imageScale(value) {
        this._imageScale = value;
        this.updateScale();
    }
}
exports.BillBoardController = BillBoardController;
