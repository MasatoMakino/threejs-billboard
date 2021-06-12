"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StageBillBoard = void 0;
const three_1 = require("three");
const StageObject3D_1 = require("./StageObject3D");
const StageTexture_1 = require("./StageTexture");
class StageBillBoard extends three_1.Sprite {
    constructor(width, height, imageScale = 1, option) {
        super();
        this._imageScale = imageScale;
        this.initTexture(width, height, option);
    }
    initTexture(width, height, option) {
        const texture = new StageTexture_1.StageTexture(width, height);
        texture.minFilter = three_1.LinearFilter;
        this.material = new three_1.SpriteMaterial({
            map: texture,
            blending: three_1.NormalBlending,
            depthTest: false,
            transparent: true,
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
        const canvas = map.domElement;
        this.scale.set(canvas.width * this._imageScale, canvas.height * this._imageScale, 1);
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
exports.StageBillBoard = StageBillBoard;
