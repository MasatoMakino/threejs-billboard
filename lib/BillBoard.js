"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillBoard = exports.BillBoardOptionUtil = void 0;
const BillBoardController_1 = require("./BillBoardController");
const three_1 = require("three");
class BillBoardOptionUtil {
    static init(option) {
        if (option == null) {
            option = {};
        }
        if (option.minFilter == null) {
            option.minFilter = three_1.LinearFilter;
        }
        return option;
    }
}
exports.BillBoardOptionUtil = BillBoardOptionUtil;
/**
 * 画像ファイルをテクスチャとするビルボードクラス
 */
class BillBoard extends three_1.Sprite {
    /**
     * コンストラクタ
     * @param url テクスチャー画像ファイルのURL
     * @param imageScale
     * @param option
     */
    constructor(url, imageScale, option) {
        super();
        option = BillBoardOptionUtil.init(option);
        this.obj = new BillBoardController_1.BillBoardController(this, url, imageScale, option);
    }
    get imageScale() {
        return this.obj.imageScale;
    }
    /**
     * 画像のスケールを指定する。
     * ScaleCalculator.getDotByDotScale関数で得られた値を設定すると、ビルボードはテクスチャ画像のサイズのまま表示される。
     * @param value
     */
    set imageScale(value) {
        this.obj.imageScale = value;
    }
}
exports.BillBoard = BillBoard;
