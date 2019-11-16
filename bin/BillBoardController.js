import { TextureLoader } from "three";
import { SpriteMaterial } from "three";
import { NormalBlending } from "three";
import { Mesh, Sprite } from "three";
import { MeshBasicMaterial } from "three";
import { PlaneBufferGeometry } from "three";
/**
 * ビルボード処理に必要な機能を備えたクラス。
 * MeshやSprite内でこのクラスを呼び出すことで、ビルボードとして機能する。
 */
export class BillBoardController {
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
        const texture = new TextureLoader().load(url, this.updateScale);
        texture.minFilter = option.minFilter;
        this._target.material = this.getMaterial(target, texture);
    }
    getMaterial(target, texture) {
        if (target instanceof Mesh) {
            return new MeshBasicMaterial({
                map: texture,
                blending: NormalBlending,
                depthTest: true,
                transparent: true
            });
        }
        if (target instanceof Sprite) {
            return new SpriteMaterial({
                map: texture,
                blending: NormalBlending,
                depthTest: true,
                transparent: true
            });
        }
    }
    initDummyPlane(target) {
        if (target instanceof Mesh) {
            const size = 0.0000001;
            target.geometry = new PlaneBufferGeometry(size, size);
        }
    }
    initGeometry(image) {
        if (this._target instanceof Mesh === false)
            return;
        if (this.isInitGeometry)
            return;
        this._target.geometry = new PlaneBufferGeometry(image.width, image.height);
        this.isInitGeometry = true;
    }
    calculateScale(img) {
        if (this._target instanceof Sprite) {
            return {
                x: img.width * this._imageScale,
                y: img.height * this._imageScale
            };
        }
        if (this._target instanceof Mesh) {
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
