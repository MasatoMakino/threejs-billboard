import { Mesh } from "three";
import { BillBoardController } from "./BillBoardController";
import { CameraChaser } from "./CameraChaser";

export class BillBoardPlane extends Mesh {
  private obj: BillBoardController;
  public cameraChaser: CameraChaser;
  /**
   * コンストラクタ
   * @param url テクスチャー画像ファイルのURL
   * @param imageScale
   * @param option
   */
  constructor(url: string, imageScale: number, option?: {}) {
    super();
    this.obj = new BillBoardController(this, url, imageScale, option);
    this.cameraChaser = new CameraChaser(this);
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
