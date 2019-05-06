import { Texture, LinearFilter } from "three";
import Stage = createjs.Stage;

export class CanvasTexture extends Texture {
  private _stage: Stage;
  private _needUpdateCanvas: boolean;
  private _renderID;

  constructor(width: number, height: number) {
    super();
    this.init(width, height);
  }

  protected init(width: number, height: number): void {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    this.image = canvas;
    this.minFilter = LinearFilter;

    this._stage = new createjs.Stage(canvas);
    this._stage.enableDOMEvents(false);
    this.start();
  }

  /**
   * テクスチャの更新を開始する
   */
  public start(): void {
    if (this._renderID != null) return;
    this._renderID = requestAnimationFrame(this.onRequestFrame);
  }

  /**
   * テクスチャの更新を停止する
   */
  public stop(): void {
    if (this._renderID == null) return;
    cancelAnimationFrame(this._renderID);
    this._renderID = null;
  }

  protected update(): void {
    this._stage.update();
    this.needsUpdate = true;
  }

  public setNeedUpdate(): void {
    this._needUpdateCanvas = true;
  }

  private onRequestFrame = (e?: any) => {
    if (this._needUpdateCanvas) {
      this.update();
      this._needUpdateCanvas = false;
    }
    this._renderID = requestAnimationFrame(this.onRequestFrame);
  };

  /**
   * このテクスチャに紐づけられたcreatejs.stageインスタンスを取得する。
   * カンバスへはstage.canvasでアクセスする。
   */
  get stage(): createjs.Stage {
    return this._stage;
  }
}
