import { TextureLoader } from "three";
import { SpriteMaterial } from "three";
import { NormalBlending } from "three";
/**
 * ビルボード処理に必要な機能を備えたクラス。
 * MeshやSprite内でこのクラスを呼び出すことで、ビルボードとして機能する。
 */
export class BillBoardControler {
    /**
     * コンストラクタ
     * @param target
     * @param url テクスチャー画像ファイルのURL
     * @param imageScale
     * @param option
     */
    constructor(target, url, imageScale, option) {
        /**
         * テクスチャ画像のアスペクト比を維持したままスケールを調整する。
         */
        this.updateScale = () => {
            const map = this._target.material.map;
            if (map == null || map.image == null)
                return;
            const img = map.image;
            this._target.scale.set(img.width * this._imageScale, img.height * this._imageScale, 1);
        };
        this._target = target;
        this._imageScale = imageScale;
        const texture = new TextureLoader().load(url, this.updateScale);
        this._target.material = new SpriteMaterial({
            map: texture,
            blending: NormalBlending,
            depthTest: true,
            transparent: true
        });
    }
    initMaterial(target) {
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
