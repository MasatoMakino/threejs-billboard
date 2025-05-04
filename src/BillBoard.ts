import { LinearFilter, Sprite, type TextureFilter } from "three";
import { BillBoardController } from "./BillBoardController.js";

export interface BillBoardOptions {
  minFilter?: TextureFilter;
}

export interface InitializedBillBoardOptions extends BillBoardOptions {
  minFilter: TextureFilter;
}

export const BillBoardOptionUtil = {
  init(option?: BillBoardOptions): InitializedBillBoardOptions {
    const initializedOption = option ?? {};
    initializedOption.minFilter ??= LinearFilter;
    return initializedOption as InitializedBillBoardOptions;
  },
};

/**
 * 画像ファイルをテクスチャとするビルボードクラス
 */
export class BillBoard extends Sprite {
  private obj: BillBoardController;
  /**
   * コンストラクタ
   * @param url テクスチャー画像ファイルのURL
   * @param imageScale
   * @param option
   */
  constructor(url: string, imageScale: number, option?: BillBoardOptions) {
    super();
    const initializedOption = BillBoardOptionUtil.init(option);
    this.obj = new BillBoardController(
      this,
      url,
      imageScale,
      initializedOption,
    );
  }

  get imageScale(): number {
    return this.obj.imageScale;
  }

  /**
   * 画像のスケールを指定する。
   * ScaleCalculator.getDotByDotScale関数で得られた値を設定すると、ビルボードはテクスチャ画像のサイズのまま表示される。
   * @param value
   */
  set imageScale(value: number) {
    this.obj.imageScale = value;
  }
}
