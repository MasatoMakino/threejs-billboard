import { Mesh } from "three";
import {
  type BillBoardOptions,
  BillBoardOptionUtil,
  CameraChaser,
} from "./index.js";
import { BillBoardController } from "./BillBoardController.js";

/**
 * 画像ファイルをテクスチャとするPlaneMesh機能を提供します。
 * CameraChaser によるカメラ追従機能も提供します。
 */
export class BillBoardPlane extends Mesh {
  private obj: BillBoardController;
  public cameraChaser: CameraChaser;
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
