"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var three_1 = require("three");
var Ticker = createjs.Ticker;
var StageTexture = /** @class */ (function (_super) {
    __extends(StageTexture, _super);
    function StageTexture(width, height) {
        var _this = _super.call(this) || this;
        _this.onRequestFrame = function (e) {
            if (!_this._needUpdateCanvas)
                return;
            _this.update();
            _this._needUpdateCanvas = false;
        };
        _this.init(width, height);
        return _this;
    }
    StageTexture.prototype.init = function (width, height) {
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        this.image = canvas;
        this.minFilter = three_1.LinearFilter;
        this._stage = new createjs.Stage(canvas);
        this._stage.enableDOMEvents(false);
        this.isStart = false;
        this.start();
    };
    /**
     * テクスチャの更新を開始する
     */
    StageTexture.prototype.start = function () {
        if (this.isStart)
            return;
        this.isStart = true;
        Ticker.addEventListener("tick", this.onRequestFrame);
    };
    /**
     * テクスチャの更新を停止する
     */
    StageTexture.prototype.stop = function () {
        if (this.isStart)
            return;
        this.isStart = false;
        Ticker.removeEventListener("tick", this.onRequestFrame);
    };
    StageTexture.prototype.update = function () {
        this._stage.update();
        this.needsUpdate = true;
    };
    StageTexture.prototype.setNeedUpdate = function () {
        this._needUpdateCanvas = true;
    };
    Object.defineProperty(StageTexture.prototype, "stage", {
        /**
         * このテクスチャに紐づけられたcreatejs.stageインスタンスを取得する。
         * カンバスへはstage.canvasでアクセスする。
         */
        get: function () {
            return this._stage;
        },
        enumerable: true,
        configurable: true
    });
    return StageTexture;
}(three_1.Texture));
exports.StageTexture = StageTexture;
