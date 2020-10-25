"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillBoardPlane = void 0;
var three_1 = require("three");
var BillBoard_1 = require("./BillBoard");
var BillBoardController_1 = require("./BillBoardController");
var CameraChaser_1 = require("./CameraChaser");
var BillBoardPlane = /** @class */ (function (_super) {
    __extends(BillBoardPlane, _super);
    /**
     * コンストラクタ
     * @param url テクスチャー画像ファイルのURL
     * @param imageScale
     * @param option
     */
    function BillBoardPlane(url, imageScale, option) {
        var _this = _super.call(this) || this;
        option = BillBoard_1.BillBoardOptionUtil.init(option);
        _this.obj = new BillBoardController_1.BillBoardController(_this, url, imageScale, option);
        _this.cameraChaser = new CameraChaser_1.CameraChaser(_this);
        return _this;
    }
    Object.defineProperty(BillBoardPlane.prototype, "imageScale", {
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
        enumerable: false,
        configurable: true
    });
    return BillBoardPlane;
}(three_1.Mesh));
exports.BillBoardPlane = BillBoardPlane;
