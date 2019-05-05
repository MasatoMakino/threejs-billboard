import { Sprite, LinearFilter, SpriteMaterial, NormalBlending } from "three";
import { CanvasTexture } from "./CanvasTexture";
export class CanvasBillBoard extends Sprite {
    constructor(width, height, imageScale = 1, option) {
        super();
        this._imageScale = imageScale;
        this.init(width, height);
    }
    init(width, height) {
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
    set imageScale(value) {
        this._imageScale = value;
        this.updateScale();
    }
    updateScale() {
        const map = this.material.map;
        this.scale.set(map.width * this._imageScale, map.height * this._imageScale, 1);
    }
    changeMapVisible(val) {
        if (this.visible === val) {
            return;
        }
        this.visible = val;
        const map = this.material.map;
        if (map == null)
            return;
        if (this.visible) {
            map.start();
        }
        else {
            map.stop();
        }
    }
}
