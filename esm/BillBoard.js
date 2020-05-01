import {BillBoardController} from "./BillBoardController";
import {LinearFilter, Sprite} from "three";

export class BillBoardOptionUtil {
    static init(option) {
        if (option == null) {
            option = {};
        }
        if (option.minFilter == null) {
            option.minFilter = LinearFilter;
        }
        return option;
    }
}
/**
 * 画像ファイルをテクスチャとするビルボードクラス
 */
export class BillBoard extends Sprite {
    /**
     * コンストラクタ
     * @param url テクスチャー画像ファイルのURL
     * @param imageScale
     * @param option
     */
    constructor(url, imageScale, option) {
        super();
        option = BillBoardOptionUtil.init(option);
        this.obj = new BillBoardController(this, url, imageScale, option);
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
