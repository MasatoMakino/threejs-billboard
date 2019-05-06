import { Texture, LinearFilter } from "three";
export class CanvasTexture extends Texture {
    constructor(width, height) {
        super();
        this.onRequestFrame = (e) => {
            if (this._needUpdateCanvas) {
                this.update();
                this._needUpdateCanvas = false;
            }
            this._renderID = requestAnimationFrame(this.onRequestFrame);
        };
        this.init(width, height);
    }
    init(width, height) {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        this.image = canvas;
        this.minFilter = LinearFilter;
        this._stage = new createjs.Stage(canvas);
        this._stage.enableDOMEvents(false);
        this.start();
    }
    /**
     * テクスチャの更新を開始する
     */
    start() {
        if (this._renderID != null)
            return;
        this._renderID = requestAnimationFrame(this.onRequestFrame);
    }
    /**
     * テクスチャの更新を停止する
     */
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
    /**
     * このテクスチャに紐づけられたcreatejs.stageインスタンスを取得する。
     * カンバスへはstage.canvasでアクセスする。
     */
    get stage() {
        return this._stage;
    }
}
