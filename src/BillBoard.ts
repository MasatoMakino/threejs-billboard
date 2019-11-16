import { Sprite } from "three";
import { BillBoardController } from "./BillBoardController";
import { TextureFilter } from "three";
import { LinearFilter } from "three";

export interface BillBoardOptions {
  minFilter?: TextureFilter;
}

export class BillBoardOptionUtil {
  static init(option: BillBoardOptions): BillBoardOptions {
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
  private obj: BillBoardController;
  /**
   * コンストラクタ
   * @param url テクスチャー画像ファイルのURL
   * @param imageScale
   * @param option
   */
  constructor(url: string, imageScale: number, option?: BillBoardOptions) {
    super();
    option = BillBoardOptionUtil.init(option);
    this.obj = new BillBoardController(this, url, imageScale, option);
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
