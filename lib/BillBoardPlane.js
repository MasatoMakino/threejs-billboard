"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillBoardPlane = void 0;
const three_1 = require("three");
const BillBoard_1 = require("./BillBoard");
const BillBoardController_1 = require("./BillBoardController");
const CameraChaser_1 = require("./CameraChaser");
class BillBoardPlane extends three_1.Mesh {
    /**
     * コンストラクタ
     * @param url テクスチャー画像ファイルのURL
     * @param imageScale
     * @param option
     */
    constructor(url, imageScale, option) {
        super();
        option = BillBoard_1.BillBoardOptionUtil.init(option);
        this.obj = new BillBoardController_1.BillBoardController(this, url, imageScale, option);
        this.cameraChaser = new CameraChaser_1.CameraChaser(this);
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
exports.BillBoardPlane = BillBoardPlane;
