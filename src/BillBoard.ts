import { Sprite, SpriteMaterial, TextureLoader, NormalBlending } from "three";
import { BillBoardObject } from "./BillBoardObject";

/**
 * 画像ファイルをテクスチャとするビルボードクラス
 */
export class BillBoard extends Sprite {
  protected _imageScale: number;

  private obj: BillBoardObject;
  /**
   * コンストラクタ
   * @param url テクスチャー画像ファイルのURL
   * @param imageScale
   * @param option
   */
  constructor(url: string, imageScale: number, option?: {}) {
    super();
    this.obj = new BillBoardObject(this, url, imageScale, option);
  }

  get imageScale(): number {
    return this._imageScale;
  }

  /**
   * 画像のスケールを指定する。
   *
   * ScaleCalculator.getDotByDotScale関数で得られた値を設定すると、ビルボードはテクスチャ画像のサイズのまま表示される。
   *
   * @param value
   */
  set imageScale(value: number) {
    this.obj.imageScale = value;
  }
}
