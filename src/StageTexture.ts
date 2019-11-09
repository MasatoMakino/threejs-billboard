import { Texture, LinearFilter } from "three";
import Stage = createjs.Stage;
import Ticker = createjs.Ticker;

export class StageTexture extends Texture {
  private _stage: Stage;
  private _needUpdateCanvas: boolean;
  private isStart: boolean;

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
    this.isStart = false;
    this.start();
  }

  /**
   * テクスチャの更新を開始する
   */
  public start(): void {
    if (this.isStart) return;
    this.isStart = true;
    Ticker.addEventListener("tick", this.onRequestFrame);
  }

  /**
   * テクスチャの更新を停止する
   */
  public stop(): void {
    if (this.isStart) return;
    this.isStart = false;
    Ticker.removeEventListener("tick", this.onRequestFrame);
  }

  protected update(): void {
    this._stage.update();
    this.needsUpdate = true;
  }

  public setNeedUpdate(): void {
    this._needUpdateCanvas = true;
  }

  private onRequestFrame = (e?: any) => {
    if (!this._needUpdateCanvas) return;
    this.update();
    this._needUpdateCanvas = false;
  };

  /**
   * このテクスチャに紐づけられたcreatejs.stageインスタンスを取得する。
   * カンバスへはstage.canvasでアクセスする。
   */
  get stage(): createjs.Stage {
    return this._stage;
  }
}
