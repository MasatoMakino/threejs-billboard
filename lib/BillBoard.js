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
var BillBoardController_1 = require("./BillBoardController");
var three_1 = require("three");
var BillBoardOptionUtil = /** @class */ (function () {
    function BillBoardOptionUtil() {
    }
    BillBoardOptionUtil.init = function (option) {
        if (option == null) {
            option = {};
        }
        if (option.minFilter == null) {
            option.minFilter = three_1.LinearFilter;
        }
        return option;
    };
    return BillBoardOptionUtil;
}());
exports.BillBoardOptionUtil = BillBoardOptionUtil;
/**
 * 画像ファイルをテクスチャとするビルボードクラス
 */
var BillBoard = /** @class */ (function (_super) {
    __extends(BillBoard, _super);
    /**
     * コンストラクタ
     * @param url テクスチャー画像ファイルのURL
     * @param imageScale
     * @param option
     */
    function BillBoard(url, imageScale, option) {
        var _this = _super.call(this) || this;
        option = BillBoardOptionUtil.init(option);
        _this.obj = new BillBoardController_1.BillBoardController(_this, url, imageScale, option);
        return _this;
    }
    Object.defineProperty(BillBoard.prototype, "imageScale", {
        get: function () {
            return this.obj.imageScale;
        },
        /**
         * 画像のスケールを指定する。
         * ScaleCalculator.getDotByDotScale関数で得られた値を設定すると、ビルボードはテクスチャ画像のサイズのまま表示される。
         * @param value
         */
        set: function (value) {
            this.obj.imageScale = value;
        },
        enumerable: true,
        configurable: true
    });
    return BillBoard;
}(three_1.Sprite));
exports.BillBoard = BillBoard;
