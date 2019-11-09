import { Texture, LinearFilter } from "three";
var Ticker = createjs.Ticker;
export class StageTexture extends Texture {
    constructor(width, height) {
        super();
        this.onRequestFrame = (e) => {
            if (!this._needUpdateCanvas)
                return;
            this.update();
            this._needUpdateCanvas = false;
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
        this.isStart = false;
        this.start();
    }
    /**
     * テクスチャの更新を開始する
     */
    start() {
        if (this.isStart)
            return;
        this.isStart = true;
        Ticker.addEventListener("tick", this.onRequestFrame);
    }
    /**
     * テクスチャの更新を停止する
     */
    stop() {
        if (this.isStart)
            return;
        this.isStart = false;
        Ticker.removeEventListener("tick", this.onRequestFrame);
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
