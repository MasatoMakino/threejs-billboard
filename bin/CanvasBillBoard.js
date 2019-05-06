import { Sprite, LinearFilter, SpriteMaterial, NormalBlending } from "three";
import { CanvasTexture } from "./CanvasTexture";
import { CanvasObject3D } from "./CanvasObject3D";
export class CanvasBillBoard extends Sprite {
    constructor(width, height, imageScale = 1, option) {
        super();
        this._imageScale = imageScale;
        this.initTexture(width, height, option);
    }
    initTexture(width, height, option) {
        const texture = new CanvasTexture(width, height);
        texture.minFilter = LinearFilter;
        this.material = new SpriteMaterial({
            map: texture,
            blending: NormalBlending,
            depthTest: false,
            transparent: true
        });
        this.updateScale();
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
    /**
     * テクスチャ画像のアスペクト比を維持したままスケールを調整する。
     */
    updateScale() {
        const map = this.material.map;
        const canvas = map.stage.canvas;
        this.scale.set(canvas.width * this._imageScale, canvas.height * this._imageScale, 1);
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
