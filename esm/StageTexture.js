import {LinearFilter, Texture} from "three";
import * as PIXI from "pixi.js";
import {Ticker} from "pixi.js";

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
        this._app = new PIXI.Application({
            autoStart: false,
            transparent: true,
            width: width,
            height: height
        });
        this.image = this._app.view;
        this.minFilter = LinearFilter;
        this._stage = this._app.stage;
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
        Ticker.shared.add(this.onRequestFrame);
    }
    /**
     * テクスチャの更新を停止する
     */
    stop() {
        if (this.isStart)
            return;
        this.isStart = false;
        Ticker.shared.remove(this.onRequestFrame);
    }
    update() {
        this._app.render();
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
    get domElement() {
        return this._app.view;
    }
}
