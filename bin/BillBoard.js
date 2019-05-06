import { Sprite, SpriteMaterial, TextureLoader, NormalBlending } from "three";
/**
 * 画像ファイルをテクスチャとするビルボードクラス
 */
export class BillBoard extends Sprite {
    /**
     * コンストラクタ
     * @param url テクスチャー画像ファイルのURL
     * @param imageScale
     * @param option
     */
    constructor(url, imageScale, option) {
        super();
        /**
         * テクスチャ画像のアスペクト比を維持したままスケールを調整する。
         */
        this.updateScale = () => {
            const map = this.material.map;
            if (map == null || map.image == null)
                return;
            const img = map.image;
            this.scale.set(img.width * this._imageScale, img.height * this._imageScale, 1);
        };
        this._imageScale = imageScale;
        const texture = new TextureLoader().load(url, this.updateScale);
        this.material = new SpriteMaterial({
            map: texture,
            blending: NormalBlending,
            depthTest: true,
            transparent: true
        });
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
