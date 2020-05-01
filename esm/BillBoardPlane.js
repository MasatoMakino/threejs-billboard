import {Mesh} from "three";
import {BillBoardOptionUtil} from "./BillBoard";
import {BillBoardController} from "./BillBoardController";
import {CameraChaser} from "./CameraChaser";

export class BillBoardPlane extends Mesh {
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
        this.cameraChaser = new CameraChaser(this);
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
