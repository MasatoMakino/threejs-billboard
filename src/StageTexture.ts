import { Application, Container, Ticker } from "pixi.js-legacy";
import { LinearFilter, Texture } from "three";

export class StageTexture extends Texture {
  private _app: Application;
  private _stage: Container;
  private _needUpdateCanvas: boolean;
  private isStart: boolean;

  constructor(width: number, height: number) {
    super();
    this.init(width, height);
  }

  protected init(width: number, height: number): void {
    this._app = new Application({
      autoStart: false,
      backgroundAlpha: 0.0,
      forceCanvas: true,
      width: width,
      height: height,
    });

    this.image = this._app.view;
    this.minFilter = LinearFilter;

    this._stage = this._app.stage;
    this.isStart = false;
    this.start();
  }

  /**
   * テクスチャの更新を開始する
   */
  public start(): void {
    if (this.isStart) return;
    this.isStart = true;
    Ticker.shared.add(this.onRequestFrame);
  }

  /**
   * テクスチャの更新を停止する
   */
  public stop(): void {
    if (this.isStart) return;
    this.isStart = false;
    Ticker.shared.remove(this.onRequestFrame);
  }

  protected update(): void {
    this._app.render();
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
   * このテクスチャに紐づけられたstageインスタンスを取得する。
   * カンバスへはstage.canvasでアクセスする。
   */
  get stage(): Container {
    return this._stage;
  }

  get domElement(): HTMLCanvasElement {
    return this._app.view;
  }
}
