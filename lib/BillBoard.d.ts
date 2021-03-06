import { Sprite, TextureFilter } from "three";
export interface BillBoardOptions {
    minFilter?: TextureFilter;
}
export declare class BillBoardOptionUtil {
    static init(option: BillBoardOptions): BillBoardOptions;
}
/**
 * 画像ファイルをテクスチャとするビルボードクラス
 */
export declare class BillBoard extends Sprite {
    private obj;
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
//# sourceMappingURL=BillBoard.d.ts.map