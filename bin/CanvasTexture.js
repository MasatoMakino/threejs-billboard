import { Texture } from "three";
import { LinearFilter } from "three";
export class CanvasTexture extends Texture {
    constructor(width, height) {
        super();
        this.render = (e) => {
            if (this._needUpdateCanvas) {
                this.update();
                this._needUpdateCanvas = false;
            }
            this._renderID = requestAnimationFrame(this.render);
        };
        this._width = width;
        this._height = height;
        this.init();
    }
    init() {
        this._canvas = document.createElement("canvas");
        this._canvas.width = this._width;
        this._canvas.height = this._height;
        this.image = this._canvas;
        this.minFilter = LinearFilter;
        this._stage = new createjs.Stage(this._canvas);
        this._stage.enableDOMEvents(false);
        this.start();
    }
    /**
     * レンダーループを開始する
     * メインのレンダーループで同上のイベントを必ず発効すること。
     */
    start() {
        if (this._renderID != null)
            return;
        this._renderID = requestAnimationFrame(this.render);
    }
    stop() {
        if (this._renderID == null)
            return;
        cancelAnimationFrame(this._renderID);
        this._renderID = null;
    }
    update() {
        this._stage.update();
        this.needsUpdate = true;
    }
    setNeedUpdate() {
        this._needUpdateCanvas = true;
    }
    get height() {
        return this._height;
    }
    get width() {
        return this._width;
    }
    get stage() {
        return this._stage;
    }
}
