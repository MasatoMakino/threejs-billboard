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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StageTexture = void 0;
var three_1 = require("three");
var PIXI = __importStar(require("pixi.js"));
var pixi_js_1 = require("pixi.js");
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
        this._app = new PIXI.Application({
            autoStart: false,
            transparent: true,
            width: width,
            height: height
        });
        this.image = this._app.view;
        this.minFilter = three_1.LinearFilter;
        this._stage = this._app.stage;
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
        pixi_js_1.Ticker.shared.add(this.onRequestFrame);
    };
    /**
     * テクスチャの更新を停止する
     */
    StageTexture.prototype.stop = function () {
        if (this.isStart)
            return;
        this.isStart = false;
        pixi_js_1.Ticker.shared.remove(this.onRequestFrame);
    };
    StageTexture.prototype.update = function () {
        this._app.render();
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
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StageTexture.prototype, "domElement", {
        get: function () {
            return this._app.view;
        },
        enumerable: false,
        configurable: true
    });
    return StageTexture;
}(three_1.Texture));
exports.StageTexture = StageTexture;
