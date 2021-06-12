"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StageTexture = void 0;
const three_1 = require("three");
const pixi_js_legacy_1 = require("pixi.js-legacy");
class StageTexture extends three_1.Texture {
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
        this._app = new pixi_js_legacy_1.Application({
            autoStart: false,
            backgroundAlpha: 0.0,
            forceCanvas: true,
            width: width,
            height: height
        });
        this.image = this._app.view;
        this.minFilter = three_1.LinearFilter;
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
        pixi_js_legacy_1.Ticker.shared.add(this.onRequestFrame);
    }
    /**
     * テクスチャの更新を停止する
     */
    stop() {
        if (this.isStart)
            return;
        this.isStart = false;
        pixi_js_legacy_1.Ticker.shared.remove(this.onRequestFrame);
    }
    update() {
        this._app.render();
        this.needsUpdate = true;
    }
    setNeedUpdate() {
        this._needUpdateCanvas = true;
    }
    /**
     * このテクスチャに紐づけられたstageインスタンスを取得する。
     * カンバスへはstage.canvasでアクセスする。
     */
    get stage() {
        return this._stage;
    }
    get domElement() {
        return this._app.view;
    }
}
exports.StageTexture = StageTexture;
