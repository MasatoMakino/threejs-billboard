import { Mesh } from "three";
import { CameraChaser } from "./CameraChaser";
import { BillBoardOptions } from "./BillBoard";
export declare class BillBoardPlane extends Mesh {
    private obj;
    cameraChaser: CameraChaser;
    /**
     * コンストラクタ
     * @param url テクスチャー画像ファイルのURL
     * @param imageScale
     * @param option
     */
    constructor(url: string, imageScale: number, option?: BillBoardOptions);
    get imageScale(): number;
    /**
     * 画像のスケールを指定する。
     * ScaleCalculator.getDotByDotScale関数で得られた値を設定すると、ビルボードはテクスチャ画像のサイズのまま表示される。
     * @param value
     */
    set imageScale(value: number);
}
//# sourceMappingURL=BillBoardPlane.d.ts.map